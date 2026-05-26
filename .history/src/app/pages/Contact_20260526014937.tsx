console.log("📩 Contact API hit");

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Mail, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactMessage } from '../utils/email';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await sendContactMessage(formData);

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.');

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Contact Us
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or need support? We're here to help you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* Contact Form */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">
                Send us a Message
              </CardTitle>

              <CardDescription>
                Fill out the form below.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>

                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>

                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Email Us
                    </h3>

                    <a
                      href="mailto:adminhydrix@gmail.com"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      adminhydrix@gmail.com
                    </a>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Visit Us
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      Kulliyyah of Information and Communication Technology,
                      International Islamic University Malaysia,
                      Jalan Gombak, 53100 Kuala Lumpur, Malaysia
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white">
              <CardContent className="p-6">

                <h3 className="font-semibold mb-3">
                  Response Time
                </h3>

                <p className="text-sm text-blue-100 leading-relaxed">
                  Our support team will respond to inquiries within 24 hours
                  during business days. For urgent flood-related emergencies,
                  please contact emergency hotline for immediate assistance.
                </p>

              </CardContent>
            </Card>

          </div>
        </div>

        {/* FAQ Preview */}
        <Card className="mt-12 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardContent className="p-8">

            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              Frequently Asked Questions
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  How do I set up my HydriX system?
                </h4>

                <p className="text-sm text-gray-600">
                  Setup instructions are provided with your device. You can also
                  visit the About Us page for component details and our support
                  team is always ready to assist.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Can I customize alert thresholds?
                </h4>

                <p className="text-sm text-gray-600">
                  Yes! Admin users can configure custom thresholds for all
                  monitored parameters through the Admin Panel to suit their
                  specific needs.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens if internet connection is lost?
                </h4>

                <p className="text-sm text-gray-600">
                  The system stores data locally and syncs when connection is
                  restored. Local alerts (LED, buzzer) continue to function
                  independently.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  How accurate are the sensors?
                </h4>

                <p className="text-sm text-gray-600">
                  Our sensors provide high accuracy and reliable performance for
                  effective flood detection. You can visit the functionality
                  page for more details on each component.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}