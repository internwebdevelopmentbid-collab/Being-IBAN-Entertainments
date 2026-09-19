import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [heroImage, setHeroImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/media?page=contact&type=cover",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contact hero image.");
        }

        const result = await response.json();
        const media = result.data || [];

        if (media.length > 0) {
          setHeroImage(media[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch contact hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send inquiry.");
      }

      toast.success("Thank you! Your inquiry has been submitted successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);

      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-studio-black px-6 pb-20 pt-32 sm:min-h-[72vh] lg:min-h-[78vh] lg:px-10 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage}
              alt="Being Iban Entertainments Studio"
              className="h-full w-full object-cover object-center opacity-50"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container-studio relative z-10">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
            Contact
          </p>

          <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-9xl">
            Let's create
            <br />
            <span className="text-white/30">together.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[12px] leading-6 text-white/60 sm:mt-10 sm:text-base sm:leading-relaxed">
            Let’s connect! Whether you have an idea, a project, or just want to
            say hello—we’re always open to conversations that spark creativity
            and collaboration.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white px-6 py-24 text-black lg:px-10 lg:py-32">
        <div className="container-studio grid gap-20 lg:grid-cols-3">
          {/* CONTACT INFORMATION */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-studio-red">
              Start a Project
            </p>

            <h2 className="mt-5 font-display text-4xl font-bold leading-tight">
              Tell us about
              <br />
              your idea.
            </h2>

            <div className="mt-12 space-y-8 text-sm">
              {/* EMAIL */}
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-studio-red text-white">
                  <Mail size={17} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                    Email
                  </p>

                  <a
                    href="mailto:contact@beingibanentertainments.com"
                    className="break-all transition-colors duration-300 hover:text-studio-red"
                  >
                    contact@beingibanentertainments.com
                  </a>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-studio-red text-white">
                  <Phone size={17} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                    Phone
                  </p>

                  <a
                    href="tel:+916293764908"
                    className="transition-colors duration-300 hover:text-studio-red"
                  >
                    +91 629 376 4908
                  </a>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-studio-red text-white">
                  <MapPin size={17} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                    Studio
                  </p>

                  <address className="not-italic leading-relaxed text-black/70">
                    5th Floor, Newton Square
                    <br />
                    Unit B, Chinar Park
                    <br />
                    Atghara, Rajarhat
                    <br />
                    Kolkata, West Bengal 700136
                  </address>
                </div>
              </div>

              {/* BUSINESS HOURS */}
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-studio-red text-white">
                  <Clock size={17} strokeWidth={1.8} />
                </div>

                <div className="w-full">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                    Business Hours
                  </p>

                  <div className="space-y-2">
                    {[
                      ["Monday", "10:30 AM – 7:30 PM"],
                      ["Tuesday", "10:30 AM – 7:30 PM"],
                      ["Wednesday", "10:30 AM – 7:30 PM"],
                      ["Thursday", "10:30 AM – 7:30 PM"],
                      ["Friday", "10:30 AM – 7:30 PM"],
                      ["Saturday", "10:30 AM – 7:30 PM"],
                      ["Sunday", "10:30 AM – 7:30 PM"],
                    ].map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between gap-4 border-b border-black/10 pb-2"
                      >
                        <span className="text-black/80">{day}</span>

                        <span className="text-black/45">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-2">
            <div className="grid gap-8 md:grid-cols-2">
              <Field
                label="Name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider">
                Tell us about the project
              </label>

              <textarea
                name="message"
                rows="6"
                placeholder="Give us the details..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full resize-none border-b border-black/20 bg-transparent py-4 outline-none placeholder:text-black/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-studio-red px-8 py-5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Inquiry →"}
            </button>
          </form>
        </div>

        {/* MAP */}
        <div className="mx-auto mt-16 w-full max-w-[1260px] overflow-hidden border border-black/10">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d471399.1801620748!2d88.442718!3d22.623715!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89fd64dea59a5%3A0x2c63e08df755b1ca!2sBeing%20Iban%20Entertainments!5e0!3m2!1sen!2sus!4v1789031782163!5m2!1sen!2sus"
            className="h-[380px] w-full grayscale-[40%] contrast-110 sm:h-[450px] lg:h-[520px]"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-3 block text-xs font-bold uppercase tracking-wider">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-b border-black/20 bg-transparent py-4 outline-none placeholder:text-black/30"
      />
    </div>
  );
}
