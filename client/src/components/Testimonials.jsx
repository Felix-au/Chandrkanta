import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Testimonials() {
  const { content } = useStore();
  const testimonials = content?.testimonials || {
    label: "Customer Love",
    title: "What Our Customers Say",
    description: "Thousands of happy customers across India trust Chandrakanta for their most special occasions.",
    items: [
      {
        id: 1,
        rating: 5,
        quote: "The Banarasi saree I ordered for my daughter's wedding was breathtaking. The zari work was even more beautiful in person. Chandrakanta never disappoints!",
        name: "Sunita Sharma",
        location: "Lucknow, Uttar Pradesh",
        avatarLetter: "S"
      },
      {
        id: 2,
        rating: 5,
        quote: "I ordered an unstitched suit set and the fabric quality is top-notch. The embroidery is incredibly detailed and colours are exactly as shown. Will definitely order again!",
        name: "Priya Mehta",
        location: "Mumbai, Maharashtra",
        avatarLetter: "P"
      },
      {
        id: 3,
        rating: 5,
        quote: "Fast delivery, beautiful packaging and the Kanjivaram saree exceeded all my expectations. The silk feels genuinely luxurious. Highly recommend Chandrakanta!",
        name: "Ananya Krishnan",
        location: "Chennai, Tamil Nadu",
        avatarLetter: "A"
      }
    ]
  };

  return (
    <section className="testi" aria-labelledby="testi-h2">
      <div className="testi-in">
        <div className="sec-hdr">
          <p className="sec-label">{testimonials.label || "Customer Love"}</p>
          <h2 className="sec-title" id="testi-h2">{testimonials.title || "What Our Customers Say"}</h2>
          <p className="sec-desc">
            {testimonials.description || "Thousands of happy customers across India trust Chandrakanta for their most special occasions."}
          </p>
        </div>

        <div className="testi-grid">
          {(testimonials.items || []).map((item) => (
            <article className="testi-card" key={item.id}>
              <div className="stars" aria-label="5 out of 5 stars">
                {"★".repeat(item.rating || 5)}
              </div>
              <blockquote className="testi-q">
                "{item.quote}"
              </blockquote>
              <div className="testi-auth">
                <div className="testi-av" aria-hidden="true">
                  {item.avatarLetter || item.name?.charAt(0) || "C"}
                </div>
                <div>
                  <p className="testi-nm">{item.name}</p>
                  <p className="testi-loc">{item.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
