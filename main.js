/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
(function() {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */
    var audio = new Audio('audio/celebrate.mp3');
    var triggered=false;
    var nosound=true;
    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        if (pct3>0 && pct4>0 && pct5>0)  {
            if (pct3<20 || pct4<20 || pct5<20)  {

            //$('#scratcher3Pct').html('It is a girl!');
            $("#scratcher3Pct").show();
            document.getElementById("scratcher3Pct").innerHTML="Scratch MORE!";
            } 
        }
        if (pct3>20 && pct4>20 && pct5>20) {
            $('#boy').text('It is a girl!');
            $('#boy').css('color','#F860AA');

            //document.getElementById("boy").style.color('#F860AA');

            $('#or').hide();
            $('#girl').hide();
            //document.getElementById("title").style.color = "#F860AA";
            document.getElementsByTagName("body")[0].style.backgroundImage = 'repeating-linear-gradient(90deg, #ff95c8, #FFFFFF)';
            //document.getElementsByTagName("body")[0].style.backgroundImage.animation = 'gradient 15s ease infinite';
            document.getElementById("title").style.fontSize = "17vmin";
            $('#H3').hide();
            $('#H4').hide();
            $('#scratcher3Pct').hide();

            confetti_effect();
        }
    };
    function scratcher3Changed(ev) {
        // Test every pixel. Very accurate, but might be slow on large
        // canvases on underpowered devices:
        //var pct = (scratcher.fullAmount() * 100)|0;
    
        // Only test every 32nd pixel. 32x faster, but might lead to
        // inaccuracy:

        pct3 = (this.fullAmount(32) * 100)|0;
        checkpct();
        
    };
    function scratcher4Changed(ev) {
        pct4 = (this.fullAmount(32) * 100)|0;
        checkpct();
    };
    function scratcher5Changed(ev) {
        pct5 = (this.fullAmount(32) * 100)|0;
       checkpct();
    };
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    };
    function confetti_effect() {
        if(triggered==true) {
            return;
        }
        if (!nosound) {
            audio.volume=0.5;
            audio.play();
        }
        triggered=true;
        // do this for 10 seconds
        var duration = 10 * 1000;
        var end = Date.now() + duration;
        var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
        var particleCount = 5;
        (function frame() {
        // launch a few confetti from the left edge
        confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FFFFFF']}
        );
        // and launch a few from the right edge
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },colors: ['#FFFFFF']}
        );

        // keep going until we are out of time
        if (Date.now() < end) {
            requestAnimationFrame(frame);
            
            return;
        }
        console.log("triggered");
        $("#resetbutton").show();
        //onResetClicked(scratchers);
        }());
        /* var duration = 10 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };

        interval = setInterval(()=> {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            console.log("triggered");

            $("#resetbutton").show();
            //onResetClicked(scratchers);
            audio.stop();
            clearInterval(interval);
            return 
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FDB3FD']});
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },colors: ['#FDB3FD'] });
        }, 250); */
         
    };
    /**
     * Reset all scratchers
     */
    function onResetClicked(scratchers) {
        var i;
        pct3=0;
        pct4=0;
        pct5=0;
        $("#scratcher3Pct").hide();
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].reset();
        }
        //$("#scratcher3Pct").html('Find the gender');
       
        $('#boy').text('Boy');
        $('#boy').css('color','#7fffd4');
        $('#or').show();
        $('#girl').show();

        //document.getElementById("title").style.color = "#000000";
        document.getElementById("title").style.fontSize = "15vmin";


        document.getElementsByTagName("body")[0].style.backgroundImage = 'repeating-linear-gradient(90deg, #ff95c8, #7fffd4)';

        $('#H3').show();
        $('#H4').show();
        triggered = false;
        audio.pause();
        audio.currentTime = 0;    
        return false;
    };
    
    /**
     * Assuming canvas works here, do all initial page setup
     */
    function initPage() {
        var scratcherLoadedCount = 0;
        var scratchers = [];
        var pct3,pct4,pct5=0;
        var i, i1;
        if (window.confirm('This scratch off contains loud sound when the gender is revealed. Do you want to continue with sound? (Ok:with sound, Cancel:without sound')) {
            nosound=false;
          } else {
            nosound=true;
        }
        //var surname = searchParams.get('surname');
        // called each time a scratcher loads
        function onScratcherLoaded(ev) {
            
            scratcherLoadedCount++;
            $("table1").width($(window).width());
            if (scratcherLoadedCount == scratchers.length) {
                // all scratchers loaded!
    
                // bind the reset button to reset all scratchers
                $('#resetbutton').on('click', function() {
                        onResetClicked(scratchers);
                    });
    
                // hide loading text, show instructions text
                //$('#loading-text').hide();
                //$('#inst-text').show();
            }
        };
    
        // create new scratchers
        var scratchers = new Array(9);
    
        for (i = 0; i < scratchers.length; i++) {
            i1 = i + 1;
            scratchers[i] = new Scratcher('scratcher' + i1);
    
            // set up this listener before calling setImages():
            scratchers[i].addEventListener('imagesloaded', onScratcherLoaded);
    
            scratchers[i].setImages('images/s' + i1 + 'bg.jpg',
                'images/foreground.jpg');
        
        }
        
        // get notifications of this scratcher changing
        // (These aren't "real" event listeners; they're implemented on top
        // of Scratcher.)
        //scratchers[3].addEventListener('reset', scratchersChanged);
        scratchers[3].addEventListener('scratchesended', scratcher3Changed);
        //scratchers[4].addEventListener('reset', scratchersChanged);
        scratchers[4].addEventListener('scratchesended', scratcher4Changed);
        //scratchers[5].addEventListener('reset', scratchersChanged);
        scratchers[5].addEventListener('scratchesended', scratcher5Changed);
    
        // Or if you didn't want to do it every scratch (to save CPU), you
        // can just do it on 'scratchesended' instead of 'scratch':
        //scratchers[2].addEventListener('scratchesended', scratcher3Changed);
    };
    
    /**
     * Handle page load
     */
    $(function() {
        if (supportsCanvas()) {
            initPage();
        } else {
            $('#scratcher-box').hide();
            $('#lamebrowser').show();
        }
    });
    
    })();
    
