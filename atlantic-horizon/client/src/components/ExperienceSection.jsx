// Data for each feature block (image + text + layout direction)
const features = [
  {
    title: "Luxury Accommodations",
    text: "Our elegantly appointed rooms and suites offer the perfect blend of comfort and sophistication. Each space is designed with your relaxation in mind, featuring premium amenities and stunning Atlantic views.",
    img: "/images/room1.jpg",
    reverse: false // normal layout (image left, text right)
  },
  {
    title: "Culinary Excellence",
    text: "Indulge in exceptional cuisine crafted by our award-winning chefs. From fine dining to casual fare, our restaurants offer diverse menus that celebrate the rich flavors of Ireland's southwest coast.",
    img: "/images/food.jpg",
    reverse: true // reversed layout (image right, text left)
  }
];

export default function ExperienceSection() {
  return (
    // Section container with soft green background and vertical spacing
    <section className="bg-[#d1ebd8] py-20 px-[10%] flex flex-col gap-16">
      {features.map((f, i) => (
        <div
          key={i}
          // Flex layout switches direction based on `reverse`
          // Stacks vertically on small screens
          className={`flex items-center justify-between gap-10 ${
            f.reverse ? "flex-row-reverse" : ""
          } max-[900px]:flex-col max-[900px]:text-center`}
        >
          {/* Image column */}
          <div className="flex-1">
            <img
              src={f.img}
              alt={f.title}
              className="w-full h-auto rounded-2xl shadow-xl block"
            />
          </div>

          {/* Text content column */}
          <div className="flex-1 p-5">
            <h3 className="font-courier text-3xl text-[#1a1a1a] mb-4 tracking-wide">
              {f.title}
            </h3>
            <p className="font-courier text-lg leading-relaxed text-[#333]">
              {f.text}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
