import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Scale, Copyright, Shield, Link, MessageSquare, AlertTriangle, FileText } from 'lucide-react';

const LegalNoticesPage = () => {
  return (
    <>
      <Helmet>
        <title>Legal Notices - Beats of Washington</title>
        <meta name="description" content="Legal Notices for Beats of Washington. Copyright, trademark, and legal information for our website and services." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-custom py-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Notices</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Important legal information about copyright, trademarks, and website usage.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
              
              {/* Copyright and Trademark Policy */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Copyright className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Copyright and Trademark Policy</h2>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All materials contained on this web site are Copyright of Beats of Washington or are licensed or otherwise published by Beats of Washington 
                    with the permission of the owner of the material. The rights in such material belong to the respective owners.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The materials posted on this site may be retrieved and downloaded solely for educational, personal or individual use and may not be used for any activity 
                    that could be does not qualify as non-profit activity, provided that such uses do not include posting, publication, transmission, or dissemination of such materials 
                    in digital or electronic form by means of the World Wide Web, e-mail, online services or any other medium now existing or hereafter developed. 
                    To use any material posted on this site for purposes other than for your individual reading or viewing, prior permission from Beats of Washington is required. 
                    You can request for such permission specifying the sections of the website or any material on the website and the usage, by sending an email to{' '}
                    <a href="mailto:contact@beatsofwa.org" className="text-primary-600 hover:underline">contact@beatsofwa.org</a>. 
                    Requests by regular mail, telephonic, facsimile or requests by any form other than email will not be addressed.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The information contained on this web site, or any other web site owned, operated, licensed, or controlled by Beats of Washington, as well as the design and layout 
                    of such web sites, contains elements protected by trade dress, copyright, or other laws, and may not be copied or imitated in whole or in part. 
                    No text, logo, graphic, sound, or image from this web site may be copied or retransmitted without the express permission of Beats of Washington.
                  </p>
                </div>
              </section>

              {/* Warranties */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Warranties</h2>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Beats of Washington makes no warranties or representations of any kind concerning the accuracy, suitability, or safety of the information contained on this web site 
                    or any linked site for any purpose. All such information is provided "as is," and with specific disclaimer of any warranties of merchantability, 
                    fitness for a particular purpose, title, or non-infringement.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Beats of Washington makes no warranties or representations of any kind that the services provided by this web site or any linked site will be uninterrupted, 
                    error-free, or that the site or the server that hosts the site are free from viruses or other forms of harmful computer code.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall Beats of Washington, its employees, its volunteers, its agents, or anyone else who has been involved in the creation, production, 
                    or delivery of these pages, be liable for any direct, incidental, or consequential damages resulting from the use of this site or any linked site.
                  </p>
                </div>
              </section>

              {/* Links to Other Web Sites */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Link className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Links to Other Web Sites</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Links to other web sites do not imply an endorsement of the materials disseminated at those web sites, nor does the existence of a link to another site 
                    imply that the organization or person publishing at that site endorses any of the materials at this site. Links to other web sites are provided by Beats of Washington 
                    as a convenience to its users. Beats of Washington is not responsible for the materials contained at any web site linked to this site.
                  </p>
                </div>
              </section>

              {/* Interactive Material */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Interactive Material</h2>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Portions of this site may allow users to post their own material. The materials posted by users do not necessarily reflect the views of Beats of Washington. 
                    By posting materials to the Beats of Washington web site, you represent that you have all necessary rights in and to such materials, and that such materials 
                    will not infringe on any personal or proprietary rights of any third parties, nor will such materials be harmful, defamatory, unlawful, threatening, obscene, 
                    lewd, lascivious, harassing, or otherwise objectionable.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Beats of Washington reserves the right, at its sole discretion, to review, edit, or delete any material posted by users that Beats of Washington for any reason 
                    whatsoever determines may be harmful, defamatory, unlawful, threatening, obscene, lewd, lascivious, harassing, potentially in violation of any party's rights, 
                    or otherwise objectionable.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Notwithstanding the foregoing, Beats of Washington expressly disclaims any responsibility or liability for any material communicated by third parties through this web site.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By posting materials to the Beats of Washington web site, you authorize Beats of Washington to use, and authorize others to use, any such materials in any manner or medium.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may not advertise or solicit on this web site without Beats of Washington's express permission.
                  </p>
                </div>
              </section>

              {/* Important Notice */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Important Notice</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    These legal notices are part of our commitment to transparency and legal compliance. We encourage you to review these notices carefully and contact us 
                    if you have any questions about our policies or procedures.
                  </p>
                </div>
              </section>

              {/* Related Documents */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Related Documents</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    For additional legal information, please review our{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a> and{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about these Legal Notices, please contact us at:{' '}
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

export default LegalNoticesPage; 