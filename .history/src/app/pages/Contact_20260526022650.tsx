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

      // 🔥 IMPORTANT: check real response properly
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Something went wrong.');
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

                <div>
                  <Label>Full Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input name="subject" value={formData.subject} onChange={handleChange} required />
                </div>

                <div>
                  <Label>Message</Label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} required rows={5} />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>

          {/* Info section unchanged */}
          <div className="space-y-6">

            <Card>
              <CardContent className="p-6">
                <Mail />
                <p>adminhydrix@gmail.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <MapPin />
                <p>IIUM Gombak, Malaysia</p>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}