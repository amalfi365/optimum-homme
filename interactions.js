(() => {
  const config = window.OPTIMUM_CONFIG || {};
  let checkout = null;
  try {
    const url = new URL(config.checkoutUrl);
    if (url.protocol === 'https:') checkout = url;
  } catch {}
  if (checkout && config.forwardCampaignParams) {
    const params = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref','fbclid','gclid']) {
      if (params.has(key) && !checkout.searchParams.has(key)) checkout.searchParams.set(key,params.get(key));
    }
  }
  document.querySelectorAll('[data-checkout]').forEach(link => {
    if (checkout) {
      link.href = checkout.href;
      link.target = config.openInNewTab ? '_blank' : '_self';
      link.rel = 'noopener noreferrer';
    } else {
      link.removeAttribute('target');
      link.addEventListener('click', event => {
        event.preventDefault();
        alert("L’accès sera bientôt disponible. Merci de votre patience.");
      });
    }
  });
  document.querySelectorAll('a[href^="#"]:not([data-checkout])').forEach(link => {
    link.addEventListener('click',event => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if(target) { event.preventDefault(); target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
    });
  });
  const items = Array.from(document.querySelectorAll('.faq-item'));
  function setOpen(item, open) {
    const button=item.querySelector('.faq-trigger');
    const answer=item.querySelector('.faq-answer');
    item.dataset.open=String(open);
    button.setAttribute('aria-expanded',String(open));
    answer.setAttribute('aria-hidden',String(!open));
    answer.style.maxHeight=open?answer.scrollHeight+'px':'0px';
    answer.style.opacity=open?'1':'0';
    const icon=item.querySelector('.faq-icon');
    icon.classList.remove('rotate-45');
    icon.style.transform=open?'rotate(45deg)':'rotate(0deg)';
  }
  items.forEach((item,index) => {
    const button=item.querySelector('.faq-trigger');
    const answer=item.querySelector('.faq-answer');
    answer.id='faq-answer-'+index;
    button.setAttribute('aria-controls',answer.id);
    setOpen(item,item.dataset.open==='true');
    button.addEventListener('click',() => {
      const open=item.dataset.open!=='true';
      items.forEach(other=>setOpen(other,other===item && open));
    });
  });
  addEventListener('resize',()=>items.forEach(item=>{if(item.dataset.open==='true')setOpen(item,true)}));
})();
