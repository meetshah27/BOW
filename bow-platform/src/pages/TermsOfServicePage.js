import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Shield, AlertTriangle, Gavel, Users, Camera, Heart } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Beats of Washington</title>
        <meta name="description" content="Terms of Service for Beats of Washington. Read our terms and conditions for event participation and website usage." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-custom py-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Please read these terms and conditions carefully before participating in our events or using our services.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
              
              {/* Event Participation Agreement */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Event Participation Agreement</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Submission of this entry constitutes an acknowledgement that I am in proper physical condition to participate in this event. 
                    Further, I waive any and all claims for myself and my heirs against Beats of Washington, its volunteers, its officers and employees, 
                    sponsors of Beats of Washington and any groups or individuals associated with this event for injury or illness including death that may result from my participation in this event. 
                    In addition, I assent to the use of any photo, film or video tape for any purpose at the event.
                  </p>
                </div>
              </section>

              {/* Waiver of Liability */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">WAIVER OF LIABILITY, RELEASE AND ASSUMPTION OF RISK</h2>
                </div>
                
                {/* Authority to Register */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Authority to Register and/or to Act as Agent</h3>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      You represent and warrant to Beats of Washington that you have full legal authority to complete this event registration and/or event ticket sales 
                      on behalf of yourself and/or any party you are registering (the "Registered Parties"), including full authority to make use of the credit or debit card 
                      to which registration fees and/or ticket sales will be charged. As used in this Agreement and Waiver, Beats of Washington refers to any and all subsidiaries, 
                      affiliated entities and supporters of Beats of Washington singly or together and its officers, employees, contractors, subcontractors, agents, volunteers and supporters.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      If you are registering a child under the age of 18 or an incapacitated adult you represent and warrant that you are the parent or legal guardian of that party 
                      and have the legal authority to enter into this agreement on their behalf and by proceeding with this event registration and/or ticket sales, you agree that 
                      the terms of this Agreement and Waiver shall apply equally to all Registered Parties.
                    </p>
                  </div>
                </div>

                {/* Waiver */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Waiver</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      You and Registered Parties understand that participation in the Event is potentially hazardous, and that a registered party should not participate unless they are medically able and properly trained. 
                      You understand that events may be held over public roads and facilities open to the public during the event and upon which hazards are to be expected. 
                      Participation carries with it certain inherent risks that cannot be eliminated completely ranging from minor injuries to catastrophic injuries, including death. 
                      You understand and agree that in consideration of being permitted to participate in the event, you and any registered party, the heirs, personal representatives or assigns of you or the registered party 
                      do hereby release, waive, discharge and covenant not to sue Beats of Washington for any and all liability from any and all claims arising from participation in the event by you or any registered party.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Gavel className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
                </div>
                
                {/* Disclaimer of Warranties */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Disclaimer of Warranties</h3>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Beats of Washington shall not be liable for any direct, indirect, incidental, special or consequential damages, resulting from (a) the use or the inability to use https://beatsofwa.org or 
                      (b) resulting from any goods or services purchased or obtained or transactions entered into through https://beatsofwa.org or (c) resulting from unauthorized access to or alteration of your transmissions or data. 
                      While Beats of Washington uses reasonable efforts to include accurate and up to date information in the Site, Beats of Washington makes no warranties or representations with respect to the content of the Site, 
                      which is provided "as is". Beats of Washington accepts no responsibility or liability whatsoever arising from or in any way connected with the use of this Site or its content.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      In particular, Beats of Washington will not be liable for the accuracy, completeness, adequacy, timeliness, or comprehensiveness of the information contained on the Site. 
                      Beats of Washington also assumes no responsibility, and shall not be liable for, any damages to, or viruses that may infect, your computer equipment or other property on account of your access to, 
                      use of, or browsing in the Site or your downloading of any materials, data, text, images, video, or audio from the Site. Beats of Washington reserves the right to interrupt or discontinue any or all of the functionality of its Site. 
                      Beats of Washington who is controlling this Site accepts no responsibility or liability whatsoever for any interruption or discontinuance of any or all functionality of its Site, 
                      whether the result of actions or omissions of an entity of Beats of Washington or a third party. You expressly agree that the use of https://beatsofwa.org is at your own risk.
                    </p>
                  </div>
                </div>

                {/* Indemnification */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Indemnification</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      You agree to indemnify and hold Beats of Washington harmless from and against any and all damages, costs, claims made by any third party due to or arising from or relating to your use of the Beats of Washington site 
                      or the violation of any term of this Agreement and Waiver as well as Beats of Washington's Privacy Policy located at{' '}
                      <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a> and Legal Notices located at{' '}
                      <a href="/terms" className="text-primary-600 hover:underline">Legal Notices</a> by you.
                    </p>
                  </div>
                </div>

                {/* Severability */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Severability</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      If any provision of this Agreement and Waiver is found to be unenforceable, it shall not affect the validity and enforceability of the remaining portions, 
                      which shall be enforced to the extent permitted by law of the State of Washington.
                    </p>
                  </div>
                </div>
              </section>

              {/* Agreement Acceptance */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Agreement Acceptance</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    By indicating your acceptance of this Agreement and Waiver, you are affirming that you have read and understand this agreement and waiver and fully understand its terms. 
                    You understand that you are giving up substantial rights, including the right to sue on behalf of yourself or a registered party. You acknowledge that you are signing the Agreement and Waiver freely and voluntarily, 
                    and intend by your acceptance to be a complete and unconditional release of all liability to the greatest extent allowed by law.
                  </p>
                </div>
              </section>

              {/* Holi Festival Information */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">About Our Events</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    The Holi festival is not just about colors; it's a celebration of joy, renewal, and the vibrant energy that comes with the changing seasons. 
                    Holi is a unique and lively experience that brings people closer, transcending barriers and spreading happiness.
                  </p>
                </div>
              </section>

              {/* Photo/Video Consent */}
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Camera className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Photo and Video Consent</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    By participating in our events, you consent to the use of any photo, film or video tape for any purpose at the event. 
                    This includes but is not limited to promotional materials, social media, and website content.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at:{' '}
                  <a href="mailto:beatsofredmond@gmail.com" className="text-primary-600 hover:underline">beatsofredmond@gmail.com</a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage; 