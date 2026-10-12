(function () {
  var $ = function (id) { return document.getElementById(id); };
  var price = $('price'), slide = $('slide'), cat = $('cat'), xbox = $('xbox'), xrate = $('xrate');
  if (!price || !slide) return;
  var CUT = 16666, MAX = parseFloat(slide.max);
  function yen(n) { return '¥' + Math.floor(n).toLocaleString('en-US'); }
  function pct(n) { return Math.max(0, n).toFixed(2) + '%'; }
  function render() {
    var p = parseFloat(price.value);
    if (!(p >= 0)) p = 0;
    var isX = cat.value === 'x';
    xbox.hidden = !isX;
    var rate = isX ? parseFloat(xrate.value) : parseFloat(cat.value);
    if (!(rate >= 0)) rate = 0;
    var tv = p * 0.6;
    var free = tv <= 10000 && !isX;
    var duty = 0, vat = 0;
    if (!free) {
      duty = Math.floor(tv * rate / 100);
      vat = Math.floor((tv + duty) * 0.10);
    }
    var tax = duty + vat;
    $('total').textContent = yen(tax);
    var v = $('verdict');
    if (free) { v.textContent = 'No tax is charged'; v.className = 'verdict free'; }
    else if (tv > 200000 && !isX) { v.textContent = 'Taxable value is over ¥200,000, so simplified rates do not apply'; v.className = 'verdict pay'; }
    else { v.textContent = 'About ' + (p ? (tax / p * 100).toFixed(1) : '0') + '% of the item price'; v.className = 'verdict pay'; }
    var sum = p + tax || 1;
    $('bi').style.width = pct(p / sum * 100);
    $('bd').style.width = pct(duty / sum * 100);
    $('bv').style.width = pct(vat / sum * 100);
    $('li').textContent = 'Item ' + yen(p);
    $('ld').textContent = 'Duty ' + yen(duty);
    $('lv').textContent = 'Consumption tax ' + yen(vat);
    var d = 'Taxable value ¥' + tv.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' (item price × 0.6)';
    if (free) d += ' = ¥10,000 or less, so neither duty nor consumption tax is charged in principle';
    else if (isX && tv <= 10000) d += ' = ¥10,000 or less, but this type of item is not exempt';
    else d += ' / duty ' + rate + '% / consumption tax 10% (incl. local)';
    $('detail').textContent = d + '. Rounding may differ at actual clearance.';
    var cutPct = isX ? 0 : (CUT / MAX * 100);
    slide.style.setProperty('--cut', cutPct + '%');
    $('cutlabel').style.display = isX ? 'none' : '';
    if (p <= MAX) slide.value = p;
  }
  slide.addEventListener('input', function () { price.value = slide.value; render(); });
  price.addEventListener('input', render);
  cat.addEventListener('change', render);
  xrate.addEventListener('input', render);
  render();
})();
