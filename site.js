// Genuine Digital · interações do site
(function(){

  var org=document.getElementById('org'), branches=org.querySelectorAll('.pz');
  document.querySelectorAll('.choice').forEach(function(c){
    c.addEventListener('click',function(){
      var ids=c.getAttribute('data-hl').split(',');
      org.classList.add('focus');
      branches.forEach(function(br){br.classList.toggle('hl',ids.indexOf(br.getAttribute('data-p'))>-1);});
      document.getElementById('metodo').scrollIntoView({behavior:'smooth'});
    });
  });
  branches.forEach(function(br){br.addEventListener('click',function(){org.classList.remove('focus');branches.forEach(function(x){x.classList.remove('hl');});});});

  var nav=document.getElementById('nav'), form=document.getElementById('leadForm'), fl=document.getElementById('floatCta');
  function onScroll(){nav.classList.toggle('scrolled',window.scrollY>8);var r=form.getBoundingClientRect();fl.classList.toggle('on',r.bottom<0);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
