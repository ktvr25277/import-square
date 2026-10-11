(function () {
  var $ = function (id) { return document.getElementById(id); };
  var price = $('price'), slide = $('slide'), cat = $('cat'), xbox = $('xbox'), xrate = $('xrate');
  if (!price || !slide) return;
  var CUT = 16666, MAX = parseFloat(slide.max);
  function yen(n) { return Math.floor(n).toLocaleString('ja-JP') + '円'; }
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
    var duty = 0, vat = 0, msg = '', cls = '';
    if (!free) {
      duty = Math.floor(tv * rate / 100);
      vat = Math.floor((tv + duty) * 0.10);
    }
    var tax = duty + vat;
    $('total').innerHTML = Math.floor(tax).toLocaleString('ja-JP') + '<small>円</small>';
    var v = $('verdict');
    if (free) { v.textContent = '税金はかかりません'; v.className = 'verdict free'; }
    else if (tv > 200000 && !isX) { v.textContent = '課税価格が20万円を超えるため、簡易税率は使えません'; v.className = 'verdict pay'; }
    else { v.textContent = '商品代の約' + (p ? (tax / p * 100).toFixed(1) : '0') + '%'; v.className = 'verdict pay'; }
    var sum = p + tax || 1;
    $('bi').style.width = pct(p / sum * 100);
    $('bd').style.width = pct(duty / sum * 100);
    $('bv').style.width = pct(vat / sum * 100);
    $('li').textContent = '商品代 ' + yen(p);
    $('ld').textContent = '関税 ' + yen(duty);
    $('lv').textContent = '消費税 ' + yen(vat);
    var d = '課税価格 ' + tv.toLocaleString('ja-JP', { maximumFractionDigits: 1 }) + '円（商品代×0.6）';
    if (free) d += ' ＝ 1万円以下なので、関税も消費税も原則かかりません。';
    else if (isX && tv <= 10000) d += ' ＝ 1万円以下でも、この品目は免税になりません。';
    else d += ' ／ 関税 ' + rate + '% ／ 消費税10%（地方消費税込み）';
    $('detail').textContent = d + '。端数処理は実際の通関と異なる場合があります。';
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
