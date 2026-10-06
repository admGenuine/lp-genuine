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
  // No celular, o menu sobe ao rolar para baixo e volta ao rolar para cima
  var mobile=window.matchMedia('(max-width:900px)'), lastY=window.scrollY;
  function onScroll(){
    var y=window.scrollY;
    nav.classList.toggle('scrolled',y>8);
    if(mobile.matches){
      if(y>lastY+6 && y>72){nav.classList.add('hide');}
      else if(y<lastY-6 || y<=72){nav.classList.remove('hide');}
    }else{nav.classList.remove('hide');}
    lastY=y;
    var r=form.getBoundingClientRect();fl.classList.toggle('on',r.bottom<0);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
