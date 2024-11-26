from rest_framework import serializers
from .models import Job, CustomUser, Profile
import random
from postmarker.core import PostmarkClient
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("There is no user registered with this email address.")
        return value

    def save(self):
        request = self.context.get('request')
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        
        # Generate the password reset token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Generate the password reset link
        frontend_url = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}/"

        # Send the password reset email using Postmark
        email_subject = 'Password Reset Request'
        from_email = 'support@allformslimited.com'
        recipient = user.email
        postmark_settings = getattr(settings, 'POSTMARK', {})
        postmark_token = postmark_settings.get('TOKEN', None)
        client = PostmarkClient(server_token=postmark_token)

        client.emails.send(
            From=from_email,
            To=recipient,
            Subject=email_subject,
            TextBody=f"Please click the link below to reset your password: \n\n{frontend_url}",
            MessageStream="outbound"
        )



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Generate a random 6-digit verification code
        verification_code = str(random.randint(100000, 999999))

        # Create user with inactive status and the verification code
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False,
            verification_code=verification_code
        )
        
        email_subject = 'Activate your account.'
        from_email = 'support@allformslimited.com'
        recipient = user.email
        postmark_settings = getattr(settings, 'POSTMARK', {})
        postmark_token = postmark_settings.get('TOKEN', None)
        client = PostmarkClient(server_token=postmark_token)

        # Send the verification code via email
        client.emails.send(
            From=from_email,
            To=recipient,  
            Subject=email_subject,
            TextBody=f"Your verification code is {verification_code}.",
            MessageStream="outbound"  # make sure to specify the correct message stream
        )

        return user



class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = CustomUser.objects.get(email=data['email'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        if user.verification_code != data['verification_code']:
            raise serializers.ValidationError("Verification code is incorrect.")

        return data

    def save(self):
        user = CustomUser.objects.get(email=self.validated_data['email'])
        user.is_active = True
        user.verification_code = None  # Clear the verification code after activation
        user.save()
        return user



class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'  # Ensure 'user' is included in the fields
        extra_kwargs = {
            'user': {'required': False},  # Make user not required, as it's set automatically
        }

class ProfileSerializer(serializers.ModelSerializer):
    jobs = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'company_name',
            'company_location',
            'company_description',
            'company_logo',
            'jobs',
        ]
        read_only_fields = ('user',)  # Make sure user is not editable through the API

    def get_jobs(self, obj):
        # Fetch jobs associated with the company's profile
        jobs = Job.objects.filter(company_name=obj.company_name)
        return JobSerializer(jobs, many=True).data


