import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, CreditCard, Cookie, Mail, User, Eye } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Beats of Washington</title>
        <meta name="description" content="Privacy Policy for Beats of Washington. Learn how we protect your personal information and maintain your privacy." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-custom py-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
              
              {/* Credit Card and Bank Information Security */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Credit Card and Bank Information Security</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Your credit card information or bank account information is secured by a reputable payment services financial institution. 
                    The information is used only for that particular transaction and is not stored except by the payment services financial institution, 
                    unless explicitly authorized by you.
                  </p>
                </div>
              </section>

              {/* Domain Name */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Eye className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Domain Name</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Beats of Washington's Web server automatically recognizes, but does not collect or use your domain name (IP address). 
                    Beats of Washington may at times anonymously track your visit in order to compile statistical information about the use of our website. 
                    We do not collect individual information about you or your use of this site.
                  </p>
                </div>
              </section>

              {/* Cookie Use */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Cookie className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Cookie Use</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    A cookie is a small amount of data that is sent to your browser from a web server and stored on your computer's hard drive. 
                    Some websites use cookies to collect detailed personal user information. Beats of Washington may use cookies to customize the content 
                    viewed by you or to check to see if you are a return visitor. Beats of Washington does not use cookies to surreptitiously collect 
                    any personal information from your computer.
                  </p>
                </div>
              </section>

              {/* Email Addresses */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Email Addresses</h2>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Our website does not automatically recognize your email address. We collect the email addresses of those who communicate with us by email 
                    and we ask for your email address via our website. If you communicate with us by email or give us your email address, we may send you 
                    periodical email updates. If you do not want to receive our periodical email updates email us at{' '}
                    <a href="mailto:contact@beatsofwa.org" className="text-primary-600 hover:underline">contact@beatsofwa.org</a> and we will remove you from our list.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We use email links to allow you to contact us directly with questions or comments. This information is used to respond directly to your 
                    questions or comments. We may also use your comments to improve our site and program. We may file the emails you send to follow up with about your comments.
                  </p>
                </div>
              </section>

              {/* Personal Information */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You do not have to provide any personal information on our website unless you choose to do so. We may ask for your name, age, address, 
                    and comments on our "Feedback" page or elsewhere. If you allow us to, we collect this information to and put you on our mailing list for periodical updates.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We do not make email addresses, postal addresses and telephone numbers available to any other organization except when explicitly agreed by you 
                    (e.g. when we have an event, we may share participant information with our sponsors, but only with explicit authorization by you). 
                    Currently we do not have any such sharing arrangements with sponsors. In the event of our getting into such an arrangement, it will explicitly not include telephone numbers.
                  </p>
                </div>
              </section>

              {/* Opt-out */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Opt-out</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    If you wish to remove yourself from any of our mailing lists, send an email to{' '}
                    <a href="mailto:contact@beatsofwa.org" className="text-primary-600 hover:underline">contact@beatsofwa.org</a>. 
                    Your privacy is very important to us. If you feel that your privacy has been violated or that Beats of Washington has misused your information in any way, 
                    please contact us at{' '}
                    <a href="mailto:contact@beatsofwa.org" className="text-primary-600 hover:underline">contact@beatsofwa.org</a>.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at:{' '}
                  <a href="mailto:contact@beatsofwa.org" className="text-primary-600 hover:underline">contact@beatsofwa.org</a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage; 