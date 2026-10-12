/* ================================================================
   VANA KUSUM — PRODUCTS, PRICES & SHIPPING  (edit this file only)
   ----------------------------------------------------------------
   The website AND the payment server both read this one file, so a
   price you change here is exactly what the customer is charged.
   After editing on GitHub → "Commit changes" → Vercel redeploys.

   Prices are in rupees, inclusive of GST.
   ================================================================ */
const CATALOG = {
  // Shipping: flat charge per order, free once the items total reaches freeAbove.
  shipping: { flat: 79, freeAbove: 799 },

  // Optional support chat number (country code, no +). Leave "" to hide the chat button.
  supportWhatsApp: "",

  products: [
    { id:"thekua", name:"Thekua", hindi:"ठेकुआ", art:"thekua",
      sizes:[{w:"400 g",price:239},{w:"800 g",price:449}],
      hdesc:"गुड़-घी वाला, हाथ से बना, धीमी आँच पर तला।",
      desc:"Gur–ghee thekua, hand-pressed and slow-fried. Chhath vibes all year." },
    { id:"litti-sattu-kit", name:"Litti Sattu Kit", hindi:"लिट्टी सत्तू", art:"kit",
      sizes:[{w:"400 g",price:199},{w:"800 g",price:369}],
      hdesc:"भुना सत्तू मसाला + माँ का नुस्खा कार्ड।",
      desc:"Sattu masala + Maa's recipe card. Litti party at home!" },
    { id:"pure-sattu", name:"Pure Sattu", hindi:"शुद्ध सत्तू", art:"sattu",
      sizes:[{w:"400 g",price:129},{w:"800 g",price:249}],
      hdesc:"पत्थर-पिसा भुना चना — शरबत, लिट्टी, पराठा।",
      desc:"Stone-ground roasted chana. Desi protein, zero drama." },
    { id:"til-laddu", name:"Til Laddu", hindi:"तिल लड्डू", art:"laddu",
      sizes:[{w:"400 g",price:269},{w:"800 g",price:509}],
      hdesc:"तिल-गुड़ के गरम-गरम हाथ से बंधे लड्डू।",
      desc:"Sesame + gur, rolled warm by hand. Winter's best hug." },
    { id:"til-auri", name:"Til-auri", hindi:"तिल औरी", art:"auri",
      sizes:[{w:"400 g",price:259},{w:"800 g",price:499}],
      hdesc:"धूप में सुखाई कुरकुरी तिल-गुड़ औरी।",
      desc:"Crispy sesame-jaggery discs. Warning: disappear fast." },
    { id:"tisi-auri", name:"Tisi-auri", hindi:"तिसी औरी", art:"auri",
      sizes:[{w:"400 g",price:259},{w:"800 g",price:499}],
      hdesc:"अलसी-गुड़ की औरी — दादी का सुपरफूड।",
      desc:"Flaxseed auri — grandma's superfood before it was cool." },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = CATALOG;
else window.CATALOG = CATALOG;
