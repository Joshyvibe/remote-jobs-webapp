// src/pages/TermsAndConditions.jsx
import React from "react";
import '../styles/TermsAndConditions.css'

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>

      <p>
        Welcome to [Your Website Name]! These terms and conditions outline the
        rules and regulations for the use of [Your Website Name]'s Website,
        located at [Your Website URL].
      </p>

      <h2>1. Introduction</h2>
      <p>
        By accessing this website we assume you accept these terms and
        conditions. Do not continue to use [Your Website Name] if you do not
        agree to take all of the terms and conditions stated on this page.
      </p>

      <h2>2. License</h2>
      <p>
        Unless otherwise stated, [Your Website Name] and/or its licensors own
        the intellectual property rights for all material on [Your Website
        Name]. All intellectual property rights are reserved. You may access
        this from [Your Website Name] for your own personal use subjected to
        restrictions set in these terms and conditions.
      </p>

      <h2>3. User Comments</h2>
      <p>
        This Agreement shall begin on the date hereof. Parts of this website
        offer an opportunity for users to post and exchange opinions and
        information in certain areas of the website. [Your Website Name] does
        not filter, edit, publish or review Comments prior to their presence on
        the website. Comments do not reflect the views and opinions of [Your
        Website Name], its agents and/or affiliates. Comments reflect the views
        and opinions of the person who posts their views and opinions.
      </p>

      <h2>4. Hyperlinking to our Content</h2>
      <p>
        The following organizations may link to our Website without prior
        written approval:
      </p>
      <ul>
        <li>Government agencies;</li>
        <li>Search engines;</li>
      </ul>
    </div>
  );
};


export default TermsAndConditions;