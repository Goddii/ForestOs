const fs = require('fs');
const file = '/home/g-asewe/forestos-qr-landing/src/javaExperience/JavaExperience.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard tailwind color names with their hex values to prevent global bleed
content = content.replace(/bg-card\/([0-9]+)/g, 'bg-[#0F2012]/$1');
content = content.replace(/bg-card(?!-)/g, 'bg-[#0F2012]');

content = content.replace(/bg-background\/([0-9]+)/g, 'bg-[#08150A]/$1');
content = content.replace(/bg-background(?!-)/g, 'bg-[#08150A]');

content = content.replace(/bg-secondary\/([0-9]+)/g, 'bg-[#172B1A]/$1');
content = content.replace(/bg-secondary(?!-)/g, 'bg-[#172B1A]');

// Add <Footer /> to main
content = content.replace('<StoreLocator />\n\n        </main>', '<StoreLocator />\n          <Footer />\n\n        </main>');

// Append Footer component
const footerCode = `
function Footer() {
  return (
    <footer className="relative bg-[#08150A] border-t border-border py-12 overflow-hidden">
      <TribalPattern id="footer-tribal" opacity={0.1} />
      <div className="relative z-10 px-6 max-w-md mx-auto text-center">
        <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-4 bg-[#0F2012]">
          <SunLogo size={36} />
        </div>
        <p className="text-primary font-medium tracking-widest text-xs uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Java House Kenya</p>
        <h3 className="text-[#EDE8DC] text-xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Gold Label Black Tea</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Proudly partnering with the Nyayo Tea Zone Development Corporation to protect Kenya's highland forest heritage — one cup at a time.
        </p>
        <div className="flex items-center justify-center gap-6 mb-8">
          {["About", "Stores", "Sustainability", "Contact"].map((link) => (
            <a key={link} href="#" className="text-muted-foreground text-xs hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{link}</a>
          ))}
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-muted-foreground/50 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Java House Kenya Ltd. All rights reserved.<br />Conservation Tea · Nyayo Tea Zone, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
`;

if (!content.includes('function Footer()')) {
  content += footerCode;
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated JavaExperience.jsx');
