/* ============================================================
   CHIMIZH — site settings + showcase content
   ============================================================ */

const SITE = {
  name: "Chimizh",
  // TODO: replace with the client's real details
  whatsapp: "918304038094",          // country code + number, no "+" or spaces
  phone: "+91 83040 38094",
  email: "chimizh.antiques@gmail.com",
  address: ["Pattuvilakam Street, Chenthittai", "Chalai P.O., Thiruvananthapuram", "Kerala – 695036"],
  // Google doesn't index "Pattuvilakam Street" here (it matches a lane in Ambalamukku instead),
  // so the map points at the Chenthittai locality. Replace with the shop's own Google Maps
  // listing name once its Google Business Profile is live.
  mapQuery: "Chenthittai, Thiruvananthapuram, Kerala 695036",
  hours: [
    ["Monday – Saturday", "10 am – 7:30 pm"],
    ["Sunday", "By appointment"],
  ],
  instagram: "https://www.instagram.com/chimizh.antiques",
  facebook: "https://www.facebook.com/share/1FdEuhbhpn/?mibextid=wwXIfr",
  youtube: "https://youtube.com/@chimizh.antiques",
  olx: "https://www.olx.in/profile/651628013",
};

/* SHOWCASE — illustrative images only.
   These are NOT the client's products and are NOT for sale.
   They show the kinds of vessels Chimizh deals in. */
const SHOWCASE = [
  { img: "lotus-brass-bottle",        form: "The Lotus Bottle",  kind: "Rose-water bottle",  metal: "Brass",      note: "Petals hammered from a single sheet of metal." },
  { img: "engraved-brass-ewer",       form: "The Aftaba",        kind: "Hand-washing ewer",  metal: "Brass",      note: "Engraved by hand from lid to foot." },
  { img: "copper-water-ewer",         form: "The Ibrik",         kind: "Water ewer",         metal: "Copper",     note: "Hand-raised copper, tinned inside." },
  { img: "carved-terracotta-pot",     form: "The Kalam",         kind: "Water pot",          metal: "Terracotta", note: "Clay that keeps water cool in summer." },
  { img: "dragon-handle-brass-vase",  form: "The Ritual Vase",   kind: "Altar vessel",       metal: "Cast brass", note: "Cast in the style of ancient bronzes." },
  { img: "pewter-tea-pot",            form: "The Tea Pot",       kind: "Serving vessel",     metal: "Pewter",     note: "The hammer marks still catch the light." },
  { img: "scandinavian-brass-pitcher",form: "The Pitcher",       kind: "Table jug",          metal: "Brass",      note: "Heavy, plain and made to be used." },
  { img: "brass-tea-pot",             form: "The Mint Pot",      kind: "Tea pot",            metal: "Brass",      note: "Made for pouring tea from a height." },
];

function waLink(text) {
  return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text);
}
