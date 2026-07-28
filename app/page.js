"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BarChart3, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3,
  Compass, CreditCard, Heart, HelpCircle, LayoutDashboard, LockKeyhole,
  LogIn, LogOut, Mail, Map, MapPin, Menu, MessageCircle, Minus, Palmtree,
  Plus, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, TicketCheck,
  Trash2, TrendingUp, User, UserPlus, Users, Waves, X
} from "lucide-react";
import { CATEGORY_LABELS, COPY, LOCATION_LABELS, localizeTour } from "./i18n";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${BASE_PATH}${path}`;

const BASE_TOURS = [
  { id: 1, title: "Blue Hole & Secret Falls", location: "Ocho Rios", category: "Adventure", duration: "5 hours", price: 129, rating: 4.9, reviews: 184, image: asset("/images/blue-hole.jpg"), badge: "Bestseller", description: "Swim in turquoise pools, climb hidden waterfalls, and discover one of Jamaica’s most refreshing natural escapes.", includes: ["Private round-trip transfer", "Local guide", "Entry fees", "Bottled water"] },
  { id: 2, title: "Kingston Culture Walk", location: "Kingston", category: "Culture", duration: "3 hours", price: 65, rating: 4.8, reviews: 96, image: asset("/images/walking-one.jpg"), badge: "Local favourite", description: "See Kingston through local eyes—music, murals, markets, architecture, and stories beyond the guidebooks.", includes: ["Expert city guide", "Local tasting", "Museum entry", "Small group"] },
  { id: 3, title: "Rose Hall After Dark", location: "Montego Bay", category: "History", duration: "3.5 hours", price: 92, rating: 4.7, reviews: 121, image: asset("/images/rose-hall.jpg"), badge: "Iconic", description: "Explore Jamaica’s legendary great house at twilight and hear the unforgettable story of the White Witch.", includes: ["Hotel pickup", "Guided great-house tour", "Welcome drink", "Return transfer"] },
  { id: 4, title: "Island Flavours & Coast", location: "Negril", category: "Food & culture", duration: "6 hours", price: 145, rating: 5.0, reviews: 77, image: asset("/images/tour-beach.jpg"), badge: "New", description: "A relaxed day of coastal views, local food, colourful communities, and one of the Caribbean’s best sunsets.", includes: ["Private driver", "Lunch tasting", "Beach stop", "Sunset experience"] },
  { id: 5, title: "Hidden Jamaica Discovery", location: "Falmouth", category: "Nature", duration: "4 hours", price: 110, rating: 4.9, reviews: 58, image: asset("/images/walking-two.jpg"), badge: "Private tour", description: "Leave the resort road behind for lush countryside, river views, and meaningful encounters with local Jamaica.", includes: ["Private guide", "Air-conditioned transfer", "Refreshments", "Flexible itinerary"] },
  { id: 6, title: "Falls, River & Village Day", location: "Montego Bay", category: "Adventure", duration: "7 hours", price: 165, rating: 4.8, reviews: 143, image: asset("/images/tour-falls.jpg"), badge: "Full day", description: "A full-day island adventure combining cool river water, dramatic falls, and warm Jamaican hospitality.", includes: ["Hotel pickup", "All admissions", "Jamaican lunch", "Certified guide"] }
];

const SEED_BOOKINGS = [
  { id: "LTJ-4821", guest: "Amelia Hart", tour: "Blue Hole & Secret Falls", date: "2026-08-14", people: 2, total: 258, status: "Confirmed" },
  { id: "LTJ-4792", guest: "Marcus Reid", tour: "Kingston Culture Walk", date: "2026-08-09", people: 3, total: 195, status: "Confirmed" },
  { id: "LTJ-4768", guest: "Sofia Lopez", tour: "Rose Hall After Dark", date: "2026-08-02", people: 2, total: 184, status: "Pending" }
];

const categories = ["All experiences", "Adventure", "Culture", "Nature", "History", "Food & culture"];

function Logo() {
  return <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><img src={asset("/images/logo.png")} alt="Love Travel Jamaica" /></button>;
}

function Modal({ open, onClose, children, wide = false, closeLabel = "Close dialog" }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="close-btn" onClick={onClose} aria-label={closeLabel}><X /></button>{children}</div></div>;
}

function Stars({ rating, reviews }) {
  return <span className="stars"><Star size={14} fill="currentColor" /> <b>{rating}</b> <small>({reviews})</small></span>;
}

function TourCard({ tour, language, t, onBook, onDetails }) {
  const displayTour = localizeTour(tour, language);
  return <article className="tour-card">
    <button className="tour-image" onClick={() => onDetails(tour)} style={{ backgroundImage: `url("${tour.image}")` }} aria-label={`${t("viewTour")} ${displayTour.title}`}>
      <span className="tour-badge">{displayTour.badge}</span><span className="heart"><Heart size={18} /></span>
    </button>
    <div className="tour-body">
      <div className="tour-meta"><span><MapPin size={13} />{displayTour.location}</span><Stars rating={tour.rating} reviews={tour.reviews} /></div>
      <button className="tour-title" onClick={() => onDetails(tour)}>{displayTour.title}</button>
      <div className="tour-footer"><span><Clock3 size={14} />{displayTour.duration}</span><div><small>{t("from")}</small><b>US${tour.price}</b></div></div>
      <button className="book-line" onClick={() => onBook(tour)}>{t("checkAvailability")} <ArrowRight size={16} /></button>
    </div>
  </article>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [bookingTour, setBookingTour] = useState(null);
  const [detailTour, setDetailTour] = useState(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("All experiences");
  const [location, setLocation] = useState("All Jamaica");
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("2026-08-14");
  const [pickup, setPickup] = useState("Montego Bay hotels");
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [tours, setTours] = useState(BASE_TOURS);
  const [adminTab, setAdminTab] = useState("overview");
  const [newTourOpen, setNewTourOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("ltj-user");
    const savedBookings = localStorage.getItem("ltj-bookings");
    const savedLanguage = localStorage.getItem("ltj-language");
    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    const browserLanguages = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    const firstSupportedLanguage = browserLanguages.find((item) => {
      const normalizedLanguage = item.toLowerCase();
      return normalizedLanguage.startsWith("en") || normalizedLanguage.startsWith("ru");
    });
    const preferredLanguage = firstSupportedLanguage?.toLowerCase().startsWith("ru") ? "ru" : "en";
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    setLanguage(
      requestedLanguage === "ru" || requestedLanguage === "en"
        ? requestedLanguage
        : savedLanguage === "ru" || savedLanguage === "en"
          ? savedLanguage
          : preferredLanguage
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "ru" ? "Love Travel Jamaica | Экскурсии и трансферы" : "Love Travel Jamaica | Authentic Island Experiences";
  }, [language]);

  const t = (key) => COPY[language][key] || COPY.en[key] || key;
  const categoryLabel = (value) => CATEGORY_LABELS[language][value] || value;
  const locationLabel = (value) => LOCATION_LABELS[language][value] || value;
  const detailDisplay = detailTour ? localizeTour(detailTour, language) : null;
  const bookingDisplay = bookingTour ? localizeTour(bookingTour, language) : null;

  const visibleTours = useMemo(() => tours.filter((tour) => {
    const categoryMatch = category === "All experiences" || tour.category === category;
    const locationMatch = location === "All Jamaica" || tour.location === location;
    const displayTour = localizeTour(tour, language);
    const textMatch = `${displayTour.title} ${displayTour.location} ${displayTour.category}`.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && locationMatch && textMatch;
  }), [tours, category, location, search, language]);

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    localStorage.setItem("ltj-language", nextLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.history.replaceState({}, "", url);
  }

  function toast(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  }

  function login(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).toLowerCase();
    const role = email.startsWith("admin") ? "admin" : "customer";
    const nextUser = { name: role === "admin" ? "Nadia Campbell" : email.split("@")[0].replace(/[._-]/g, " "), email, role };
    localStorage.setItem("ltj-user", JSON.stringify(nextUser));
    setUser(nextUser); setLoginOpen(false);
    if (role === "admin") setAdminOpen(true); else setDashboardOpen(true);
    toast(role === "admin" ? "Admin dashboard unlocked." : t("loginSuccess"));
  }

  function signup(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextUser = { name: `${form.get("firstName")} ${form.get("lastName")}`, email: form.get("email"), role: "customer" };
    localStorage.setItem("ltj-user", JSON.stringify(nextUser));
    setUser(nextUser); setSignupOpen(false); setDashboardOpen(true);
    toast(t("signupSuccess"));
  }

  function logout() {
    localStorage.removeItem("ltj-user");
    setUser(null); setDashboardOpen(false); setAdminOpen(false);
    toast(t("logoutSuccess"));
  }

  function confirmBooking(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const booking = {
      id: `LTJ-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: user?.name || String(form.get("guestName")),
      tour: bookingDisplay.title,
      date,
      people: guests,
      total: bookingTour.price * guests,
      status: "Confirmed"
    };
    const next = [booking, ...bookings];
    setBookings(next); localStorage.setItem("ltj-bookings", JSON.stringify(next));
    setBookingTour(null); toast(`${language === "ru" ? "Бронирование" : "Booking"} ${booking.id} ${t("bookingConfirmed")}`);
    if (user) setDashboardOpen(true);
  }

  function addTour(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const tour = {
      id: Date.now(), title: form.get("title"), location: form.get("location"),
      category: form.get("category"), duration: form.get("duration"),
      price: Number(form.get("price")), rating: 5.0, reviews: 0,
      image: asset("/images/tour-local.jpg"), badge: "Just added",
      description: form.get("description") || "A new locally guided Jamaican experience.",
      includes: ["Local guide", "Guest support", "Flexible experience"]
    };
    setTours([tour, ...tours]); setNewTourOpen(false); toast("New tour published.");
  }

  function openDashboard() {
    if (!user) setLoginOpen(true);
    else if (user.role === "admin") setAdminOpen(true);
    else setDashboardOpen(true);
  }

  const customerBookings = user ? bookings.filter((b) => b.guest.toLowerCase().includes(user.name.split(" ")[0].toLowerCase())) : [];

  return <main>
    {notice && <div className="toast"><Check size={17} />{notice}</div>}
    <header className="header">
      <div className="utility"><div className="wrap utility-inner"><span><Mail size={13} /> hello@lovetraveljamaica.com</span><span><MessageCircle size={13} /> WhatsApp +1 (876) 557-1780</span><span className="utility-push">{t("owned")}</span></div></div>
      <div className="wrap nav">
        <Logo />
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#experiences" onClick={() => setMenuOpen(false)}>{t("experiences")}</a>
          <a href="#transfers" onClick={() => setMenuOpen(false)}>{t("transfers")}</a>
          <a href="#why-us" onClick={() => setMenuOpen(false)}>{t("whyUs")}</a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>{t("stories")}</a>
          <button className="mobile-account" onClick={() => { setMenuOpen(false); openDashboard(); }}>{user ? t("openAccount") : t("loginSignup")}</button>
        </nav>
        <div className="nav-actions">
          <div className="language-switcher" aria-label={t("languageLabel")}><button className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")} aria-pressed={language === "en"}>EN</button><button className={language === "ru" ? "active" : ""} onClick={() => changeLanguage("ru")} aria-pressed={language === "ru"}>RU</button></div>
          <button className="account-link" onClick={openDashboard}>{user ? <User size={17} /> : <LogIn size={17} />}{user ? user.name.split(" ")[0] : t("login")}</button>
          <a className="button sunny small-button" href="#experiences">{t("exploreTours")}</a>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("menuLabel")} aria-expanded={menuOpen}><Menu /></button>
        </div>
      </div>
    </header>

    <section className="hero" style={{ backgroundImage: `url("${asset("/images/hero-premium.jpg")}")` }}>
      <div className="hero-overlay" />
      <div className="wrap hero-content">
        <span className="kicker light"><Palmtree size={17} /> {t("heroKicker")}</span>
        <h1>{t("heroLine1")}<br /><em>{t("heroLine2")}<span className="mobile-break"><br /></span> {t("heroLine3")}</em></h1>
        <p>{t("heroText")}</p>
        <div className="hero-proof"><span><BadgeCheck />{t("trustedHosts")}</span><span><ShieldCheck />{t("clearPricing")}</span><span><MessageCircle />{t("realSupport")}</span></div>
      </div>
      <div className="wrap search-panel">
        <div className="search-tabs"><button className="active"><Compass size={16} />{t("findExperience")}</button><button onClick={() => document.querySelector("#transfers").scrollIntoView({ behavior: "smooth" })}><MapPin size={16} />{t("bookTransfer")}</button></div>
        <div className="search-grid">
          <Field label={t("whereGo")}><select value={location} onChange={(e) => setLocation(e.target.value)}>{["All Jamaica", "Montego Bay", "Ocho Rios", "Kingston", "Negril", "Falmouth"].map((item) => <option value={item} key={item}>{locationLabel(item)}</option>)}</select></Field>
          <Field label={t("whatInto")}><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option value={item} key={item}>{categoryLabel(item)}</option>)}</select></Field>
          <Field label={t("when")}><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <a href="#experiences" className="button sunny search-button"><Search size={19} />{t("search")}</a>
        </div>
      </div>
    </section>

    <section className="trust-strip" aria-label={t("trustLabel")}><div className="wrap trust-grid"><div><strong>{t("local")}</strong><span>{t("jamaicanGuides")}</span></div><div><strong>{t("simple")}</strong><span>{t("clearPrices")}</span></div><div><strong>{t("flexible")}</strong><span>{t("flexiblePickup")}</span></div><div><strong>{t("helpful")}</strong><span>{t("tripSupport")}</span></div></div></section>

    <section className="section experiences wrap" id="experiences">
      <div className="section-head"><div><span className="kicker">{t("exploreWay")}</span><h2>{t("chooseKind")} <em>{t("jamaica")}</em></h2></div><p>{t("experiencesIntro")}</p></div>
      <div className="tour-tools">
        <div className="category-pills">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{categoryLabel(item)}</button>)}</div>
        <label className="mini-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchTours")} /></label>
      </div>
      <div className="tour-grid">{visibleTours.map((tour) => <TourCard tour={tour} language={language} t={t} key={tour.id} onBook={setBookingTour} onDetails={setDetailTour} />)}</div>
      {!visibleTours.length && <div className="empty-state"><Search /><h3>{t("noTours")}</h3><p>{t("noToursText")}</p><button onClick={() => { setCategory("All experiences"); setLocation("All Jamaica"); setSearch(""); }}>{t("clearFilters")}</button></div>}
    </section>

    <section className="section transfer-section" id="transfers">
      <div className="wrap transfer-card">
        <div className="transfer-copy"><span className="kicker light">{t("airportEasy")}</span><h2>{t("landBreathe")}<br /><em>{t("inJamaica")}</em></h2><p>{t("transferText")}</p><div className="transfer-points"><span><Check />{t("flightTracking")}</span><span><Check />{t("waitingTime")}</span><span><Check />{t("privateVehicle")}</span></div></div>
        <form className="transfer-form" onSubmit={(e) => { e.preventDefault(); toast(t("quoteReady")); }}>
          <span>{t("instantQuote")}</span><h3>{t("takingYou")}</h3>
          <Field label={t("pickup")}><select><option>Montego Bay Airport (MBJ)</option><option>Kingston Airport (KIN)</option><option>{t("hotelVilla")}</option></select></Field>
          <Field label={t("destination")}><select><option>{locationLabel("Montego Bay")}</option><option>{locationLabel("Negril")}</option><option>{locationLabel("Ocho Rios")}</option><option>{locationLabel("Falmouth")}</option><option>{locationLabel("Kingston")}</option></select></Field>
          <div className="field-pair"><Field label={t("arrivalDate")}><input type="date" defaultValue="2026-08-14" /></Field><Field label={t("passengers")}><select><option>{t("guests13")}</option><option>{t("guests46")}</option><option>{t("guests710")}</option></select></Field></div>
          <button className="button sunny full" type="submit">{t("seePrice")} <ArrowRight size={17} /></button>
        </form>
      </div>
    </section>

    <section className="section why wrap" id="why-us">
      <div className="why-image" style={{ backgroundImage: `url("${asset("/images/walking-two.jpg")}")` }}><span className="floating-review"><Stars rating="5.0" reviews="2,400+" /><b>{t("reviewQuote")}</b><small>{t("reviewAuthor")}</small></span></div>
      <div className="why-copy"><span className="kicker">{t("designedForYou")}</span><h2>{t("easyBook")}<br /><em>{t("personal")}</em></h2><p>{t("whyText")}</p>
        <div className="why-list"><div><span><Users /></span><div><b>{t("smallGroups")}</b><p>{t("smallGroupsText")}</p></div></div><div><span><Map /></span><div><b>{t("usefulDetails")}</b><p>{t("usefulDetailsText")}</p></div></div><div><span><ShieldCheck /></span><div><b>{t("planningSupport")}</b><p>{t("planningSupportText")}</p></div></div></div>
      </div>
    </section>

    <section className="section stories" id="stories"><div className="wrap">
      <div className="section-head centered"><div><span className="kicker">{t("stories")}</span><h2>{t("goodDays")} <em>{t("honestly")}</em></h2></div></div>
      <div className="story-grid">
        {(language === "ru" ? [
          ["«Гид превратил прекрасный день в главное событие нашего медового месяца».", "Майя и Крис", "Нью-Йорк"],
          ["«Встреча в аэропорту прошла легко, еда была невероятной, и нас никто не торопил».", "Даниэль Р.", "Лондон"],
          ["«Дети до сих пор вспоминают Блю-Хоул. Весь день мы чувствовали себя в безопасности».", "Семья Уильямс", "Атланта"]
        ] : [
          ["“Our guide turned a beautiful day into the highlight of our honeymoon.”", "Maya & Chris", "New York"],
          ["“Easy airport pickup, incredible local food, and not one moment felt rushed.”", "Danielle R.", "London"],
          ["“The children are still talking about Blue Hole. We felt safe and cared for all day.”", "The Williams family", "Atlanta"]
        ]).map(([quote, name, place]) => <article key={name}><Stars rating="5.0" reviews="" /><p>{quote}</p><div><span>{name.charAt(0)}</span><b>{name}<small>{place}</small></b></div></article>)}
      </div>
    </div></section>

    <section className="cta"><div className="wrap cta-inner"><div><span className="kicker light">{t("ctaKicker")}</span><h2>{t("ctaTitle1")}<br />{t("ctaTitle2")}</h2></div><div><a href="#experiences" className="button cream">{t("findYours")} <ArrowRight /></a><button className="whatsapp" onClick={() => toast(t("whatsappOpened"))}><MessageCircle />{t("whatsappPlan")}</button></div></div></section>

    <footer><div className="wrap footer-grid"><div className="footer-brand"><Logo /><p>{t("footerText")}</p><span><MapPin size={14} />{locationLabel("Montego Bay")}, Jamaica</span></div><div><b>{t("explore")}</b><a href="#experiences">{t("allExperiences")}</a><a href="#transfers">{t("airportTransfers")}</a><a href="#why-us">{t("aboutUs")}</a><a href="#stories">{t("reviews")}</a></div><div><b>{t("support")}</b><a href="#">{t("helpCentre")}</a><a href="#">{t("cancellation")}</a><a href="#">{t("privacy")}</a><a href="#">{t("terms")}</a></div><div><b>{t("stayClose")}</b><p>{t("newsletter")}</p><label className="subscribe"><input placeholder={t("emailAddress")} /><button aria-label={t("emailAddress")} onClick={() => toast(t("listSubscribed"))}><ArrowRight /></button></label></div></div><div className="wrap footer-bottom"><span>© 2026 Love Travel Jamaica</span><span>{t("madeInJamaica")} · {t("createdBy")} <a href="https://emiops.com" target="_blank" rel="noreferrer">EmiOps.com</a></span></div></footer>

    <Modal open={!!detailTour} onClose={() => setDetailTour(null)} closeLabel={t("closeDialog")} wide>
      {detailTour && <div className="detail-layout"><div className="detail-image" style={{ backgroundImage: `url("${detailTour.image}")` }}><span>{detailDisplay.badge}</span></div><div className="detail-copy"><span className="kicker">{detailDisplay.category} · {detailDisplay.location}</span><h2>{detailDisplay.title}</h2><Stars rating={detailTour.rating} reviews={detailTour.reviews} /><p>{detailDisplay.description}</p><div className="detail-facts"><span><Clock3 />{detailDisplay.duration}</span><span><Users />{t("smallPrivate")}</span><span><MapPin />{t("hotelPickup")}</span></div><h4>{t("included")}</h4><ul>{detailDisplay.includes.map((item) => <li key={item}><Check />{item}</li>)}</ul><div className="detail-price"><div><small>{t("from")}</small><b>US${detailTour.price}</b><span>{t("perPerson")}</span></div><button className="button sunny" onClick={() => { setDetailTour(null); setBookingTour(detailTour); }}>{t("checkAvailability")} <ArrowRight /></button></div></div></div>}
    </Modal>

    <Modal open={!!bookingTour} onClose={() => setBookingTour(null)} closeLabel={t("closeDialog")} wide>
      {bookingTour && <form className="booking-layout" onSubmit={confirmBooking}><div className="booking-summary"><span className="kicker light">{t("islandDay")}</span><div className="booking-thumb" style={{ backgroundImage: `url("${bookingTour.image}")` }} /><h3>{bookingDisplay.title}</h3><p><MapPin />{bookingDisplay.location}</p><p><Clock3 />{bookingDisplay.duration}</p><div className="booking-total"><span>{t("total")}</span><strong>US${bookingTour.price * guests}</strong><small>{t("taxesIncluded")}</small></div></div><div className="booking-form"><span className="kicker">{t("reserveSpot")}</span><h2>{t("almostReady")}</h2><div className="booking-steps"><span className="active">1</span><i /><span className="active">2</span><i /><span>3</span></div><Field label={t("chooseDate")}><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></Field><div className="guest-control"><div><b>{t("guests")}</b><small>US${bookingTour.price} {t("perPerson")}</small></div><div><button type="button" aria-label="-" onClick={() => setGuests(Math.max(1, guests - 1))}><Minus /></button><b>{guests}</b><button type="button" aria-label="+" onClick={() => setGuests(guests + 1)}><Plus /></button></div></div><Field label={t("pickupLocation")}><select value={pickup} onChange={(e) => setPickup(e.target.value)}><option value="Montego Bay hotels">{locationLabel("Montego Bay")}</option><option value="Ocho Rios hotels">{locationLabel("Ocho Rios")}</option><option value="Falmouth cruise port">{locationLabel("Falmouth")}</option><option value="Kingston hotels">{locationLabel("Kingston")}</option><option value="I’ll confirm later">{t("confirmLater")}</option></select></Field>{!user && <div className="field-pair"><Field label={t("leadGuest")}><input name="guestName" required placeholder={t("fullName")} /></Field><Field label={t("emailAddress")}><input type="email" required placeholder="you@example.com" /></Field></div>}<button className="button sunny full" type="submit"><CreditCard size={17} />{t("confirmBooking")} — US${bookingTour.price * guests}</button><p className="secure-note"><LockKeyhole />{t("demoPayment")}</p></div></form>}
    </Modal>

    <Modal open={loginOpen} onClose={() => setLoginOpen(false)} closeLabel={t("closeDialog")}>
      <div className="auth-icon"><LogIn /></div><span className="kicker">{t("welcomeBack")}</span><h2>{t("loginTrips")}</h2><p className="modal-intro">{t("demoLogin")}</p>
      <form onSubmit={login}><Field label={t("emailAddress")}><input name="email" type="email" required placeholder="you@example.com" /></Field><Field label={t("password")}><input name="password" type="password" required minLength="6" placeholder="••••••••" /></Field><div className="form-between"><label><input type="checkbox" />{t("remember")}</label><button type="button">{t("forgotPassword")}</button></div><button className="button sunny full">{t("login")} <ArrowRight /></button><p className="auth-switch">{t("newHere")} <button type="button" onClick={() => { setLoginOpen(false); setSignupOpen(true); }}>{t("createAccount")}</button></p></form>
    </Modal>

    <Modal open={signupOpen} onClose={() => setSignupOpen(false)} closeLabel={t("closeDialog")}>
      <div className="auth-icon"><UserPlus /></div><span className="kicker">{t("islandAccount")}</span><h2>{t("travelBetter")}</h2><p className="modal-intro">{t("signupIntro")}</p><form onSubmit={signup}><div className="field-pair"><Field label={t("firstName")}><input name="firstName" required /></Field><Field label={t("lastName")}><input name="lastName" required /></Field></div><Field label={t("emailAddress")}><input name="email" type="email" required /></Field><Field label={t("password")}><input type="password" required minLength="8" placeholder={t("passwordHint")} /></Field><label className="terms"><input type="checkbox" required />{t("agreeTerms")}</label><button className="button sunny full">{t("createMyAccount")} <ArrowRight /></button></form>
    </Modal>

    <Modal open={dashboardOpen} onClose={() => setDashboardOpen(false)} closeLabel={t("closeDialog")} wide>
      <div className="customer-panel"><aside><Logo /><div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div><h3>{user?.name}</h3><p>{user?.email}</p><nav><button className="active"><TicketCheck />{t("myBookings")}</button><button><Heart />{t("savedTours")}</button><button><User />{t("profile")}</button><button><HelpCircle />{t("getHelp")}</button></nav><button className="logout" onClick={logout}><LogOut />{t("logout")}</button></aside><section><span className="kicker">{t("travellerDashboard")}</span><h2>{t("yourPlans")}</h2><div className="dashboard-banner"><div><Sparkles /><b>{t("anotherDay")}</b><p>{t("nearbyTours")}</p></div><button onClick={() => { setDashboardOpen(false); document.querySelector("#experiences").scrollIntoView({ behavior: "smooth" }); }}>{t("browseTours")} <ArrowRight /></button></div><h3>{t("upcoming")}</h3>{customerBookings.length ? customerBookings.map((b) => <div className="customer-booking" key={b.id}><span className="date-box"><b>{new Date(`${b.date}T12:00`).toLocaleDateString(language === "ru" ? "ru-RU" : "en", { day: "2-digit" })}</b><small>{new Date(`${b.date}T12:00`).toLocaleDateString(language === "ru" ? "ru-RU" : "en", { month: "short" })}</small></span><div><b>{b.tour}</b><span>{b.id} · {b.people} {t("guests").toLowerCase()}</span></div><i>{language === "ru" && b.status === "Confirmed" ? t("confirmed") : b.status}</i><strong>US${b.total}</strong></div>) : <div className="no-bookings"><CalendarDays /><h4>{t("noBookings")}</h4><p>{t("noBookingsText")}</p><button onClick={() => { setDashboardOpen(false); document.querySelector("#experiences").scrollIntoView({ behavior: "smooth" }); }}>{t("exploreExperiences")}</button></div>}</section></div>
    </Modal>

    <Modal open={adminOpen} onClose={() => setAdminOpen(false)} closeLabel={t("closeDialog")} wide>
      <div className="admin-panel"><aside><Logo /><span>ADMIN</span><nav><button className={adminTab === "overview" ? "active" : ""} onClick={() => setAdminTab("overview")}><LayoutDashboard />Overview</button><button className={adminTab === "bookings" ? "active" : ""} onClick={() => setAdminTab("bookings")}><TicketCheck />Bookings<i>{bookings.length}</i></button><button className={adminTab === "tours" ? "active" : ""} onClick={() => setAdminTab("tours")}><Compass />Tours</button><button><Users />Customers</button><button><BarChart3 />Reports</button></nav><button className="logout" onClick={logout}><LogOut />Log out</button></aside><section><div className="admin-top"><div><span className="kicker">Operations</span><h2>{adminTab === "overview" ? "Good morning, Nadia." : adminTab === "bookings" ? "Bookings" : "Tour catalogue"}</h2></div><div className="admin-user"><span>NC</span><b>Nadia<small>Administrator</small></b></div></div>
        {adminTab === "overview" && <><div className="stats-grid"><div><span><CircleDollarSign /></span><small>Revenue</small><b>US${bookings.reduce((sum, b) => sum + b.total, 0).toLocaleString()}</b><i><TrendingUp />+18.4%</i></div><div><span><TicketCheck /></span><small>Bookings</small><b>{bookings.length}</b><i><TrendingUp />+12.1%</i></div><div><span><Users /></span><small>Guests</small><b>{bookings.reduce((sum, b) => sum + b.people, 0)}</b><i>this month</i></div><div><span><Star /></span><small>Average rating</small><b>4.9</b><i>2,418 reviews</i></div></div><div className="admin-columns"><div className="chart-card"><div><h3>Booking revenue</h3><select><option>Last 6 months</option></select></div><div className="bars">{[42,58,47,72,68,91,82,100,87,113,98,124].map((h, i) => <i key={i} style={{ height: `${h}px` }} />)}</div><div className="months"><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div></div><div className="top-tours"><h3>Top experiences</h3>{tours.slice(0, 4).map((t, i) => <div key={t.id}><span>{i + 1}</span><img src={t.image} alt="" /><b>{t.title}<small>{t.location}</small></b><strong>{Math.max(8, 42 - i * 7)} bookings</strong></div>)}</div></div></>}
        {adminTab === "bookings" && <div className="table-card"><div className="table-tools"><label><Search /><input placeholder="Search bookings" /></label><button><SlidersHorizontal />Filter</button></div><table><thead><tr><th>Booking</th><th>Guest</th><th>Experience</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{bookings.map((b) => <tr key={b.id}><td><b>{b.id}</b></td><td>{b.guest}</td><td>{b.tour}<small>{b.people} guests</small></td><td>{b.date}</td><td><b>US${b.total}</b></td><td><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></td></tr>)}</tbody></table></div>}
        {adminTab === "tours" && <><div className="catalog-head"><div><p>{tours.length} active experiences</p></div><button className="button sunny" onClick={() => setNewTourOpen(true)}><Plus />Add experience</button></div><div className="admin-tour-grid">{tours.map((tour) => <article key={tour.id}><img src={tour.image} alt="" /><div><span>{tour.category}</span><h3>{tour.title}</h3><p>{tour.location} · {tour.duration}</p><footer><b>US${tour.price}</b><button onClick={() => { setTours(tours.filter((t) => t.id !== tour.id)); toast("Tour removed from this demo."); }}><Trash2 /></button></footer></div></article>)}</div></>}
      </section></div>
    </Modal>

    <Modal open={newTourOpen} onClose={() => setNewTourOpen(false)} closeLabel={t("closeDialog")}>
      <div className="auth-icon"><Plus /></div><span className="kicker">Admin tool</span><h2>Add a new experience</h2><p className="modal-intro">Publish a new tour to the catalogue.</p><form onSubmit={addTour}><Field label="Experience name"><input name="title" required /></Field><div className="field-pair"><Field label="Location"><select name="location"><option>Montego Bay</option><option>Ocho Rios</option><option>Kingston</option><option>Negril</option><option>Falmouth</option></select></Field><Field label="Category"><select name="category">{categories.slice(1).map((c) => <option key={c}>{c}</option>)}</select></Field></div><div className="field-pair"><Field label="Duration"><input name="duration" required placeholder="4 hours" /></Field><Field label="Price (USD)"><input name="price" required type="number" min="1" /></Field></div><Field label="Short description"><textarea name="description" /></Field><button className="button sunny full">Publish experience <ArrowRight /></button></form>
    </Modal>
  </main>;
}
