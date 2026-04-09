export default function Newsletter() {
  return (
    // Newsletter section with light background and decorative illustration
    <section className="newsletter-section bg-[#f5f5f5] py-20 px-[10%] relative overflow-hidden">
      
      {/* Main content container (responsive layout) */}
      <div className="max-w-5xl mx-auto flex justify-between items-start gap-12 relative z-10 max-[850px]:flex-col max-[850px]:text-center">
        
        {/* Left column: heading and description */}
        <div className="flex-1">
          <h2 className="font-georgia text-4xl text-manorGreen mb-4 font-normal">
            Sign up to receive our latest news!
          </h2>
          <p className="font-georgia text-lg text-[#666] leading-relaxed">
            Sign up here to our Newsletter to receive special offers and news
            via email directly into your inbox.
          </p>
        </div>

        {/* Right column: newsletter form */}
        <form className="flex-1 flex flex-col gap-4">
          
          {/* First name input */}
          <div className="flex flex-col gap-2 text-left max-[850px]:text-center">
            <label className="font-georgia text-sm text-[#333]">
              First Name <span className="text-[#c5a898]">*</span>
            </label>
            <input
              type="text"
              required
              className="px-3 py-2 border border-[#ccc] rounded-sm text-base"
            />
          </div>

          {/* Email input */}
          <div className="flex flex-col gap-2 text-left max-[850px]:text-center">
            <label className="font-georgia text-sm text-[#333]">
              Email Address <span className="text-[#c5a898]">*</span>
            </label>
            <input
              type="email"
              required
              className="px-3 py-2 border border-[#ccc] rounded-sm text-base"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-2 py-3 bg-manorRose text-[#333] border-none uppercase font-bold tracking-[0.2em] cursor-pointer transition hover:bg-[#c5a898] hover:text-white"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Decorative background illustration (non-interactive) */}
      <div
        className="absolute right-0 bottom-0 w-72 h-96 bg-contain bg-no-repeat opacity-10 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/horse-illustration.png')" }}
      ></div>
    </section>
  );
}
