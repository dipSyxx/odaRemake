export function HomeWelcome() {
  return (
    <div className="bg-background py-12 lg:py-16">
      <div className="container mx-auto px-5 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
          Velkommen til en litt annerledes matbutikk
        </h2>
        <p className="text-foreground/80 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
          Vi har ikke handlevogner. Vi har hverken skyvedører, hylleroter eller
          et køsystem inn mot kassa. Vi har jo ikke kø. Vi har ikke en gang
          butikker. I stedet kan du handle der det passer deg best. Mange
          foretrekker kjøkkenbordet, andre tar det kanskje i sofaen etter at
          barna har lagt seg. Og ja... I stedet for at du trenger å komme til
          oss, så bærer vi alt hjem til deg i stedet.
        </p>
      </div>
    </div>
  );
}
