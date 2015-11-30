/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 * /u/krikienoid
 *
 */

//
// Flag Waver UI
//

;(function ( window, document, $, flagWaver, undefined ) {

    var $controlImgUpload,
        $setImgUploadMode,
        $setImgLink,
        $openImgFile,
        $infoImgFile,
        $windToggle;

    //
    // Functions
    //

    // Set flag image
    function setFlagOpts ( flagData ) {
        flagWaver.flag.setOpts( flagData );
    }

    // Get URI variables
    function getURIVars () {
        var vars  = [],
            href  = window.location.href,
            pairs = href.slice( href.indexOf( '?' ) + 1 ).split( '&' ),
            pair, i;
        for ( i = 0, ii = pairs.length; i < ii; i++ ) {
            pair = pairs[ i ].split( '=' );
            vars.push( pair[ 0 ] );
            vars[ pair[ 0 ] ] = pair[ 1 ];
        }
        return vars;
    }

    // Get hash data
    function getHashData () {
        return window.location.hash.split( '#' )[ 1 ];
    }

    // Get image src from hash data
    function fromHash () {
        var hashData = getHashData(),
            imgSrc;
        if ( hashData ) {
            if ( hashData[ 0 ] === '?' ) {
                hashData = getURIVars()[ 'src' ];
                if ( hashData ) {
                    imgSrc = window.decodeURIComponent( hashData );
                }
            }
            else { // Old version links
                imgSrc = window.unescape( hashData );
            }
        }
        if ( imgSrc ) {
            $setImgLink.val( imgSrc );
            setFlagOpts( { imgSrc : imgSrc } );
        }
        else {
            $setImgLink.val( '' );
            setFlagOpts( { imgSrc : 'img/NZ.2b.png' } );
        }
    }

    // Set hash data
    function toHash () {
        if ( $setImgLink.val() ) {
            window.history.pushState(
                null,
                null,
                '#' + '?src=' + window.encodeURIComponent( $setImgLink.val() )
            );
        }
        else {
            window.history.pushState(
                null,
                null,
                window.location.pathname
            );
        }
    }

    //
    // Init
    //

    $( document ).ready( function () {

        //
        // Get DOM elements
        //

        $controlImgUpload = $( '#control-img-upload' );
        $setImgUploadMode = $( '#set-img-upload-mode' );
        $setImgLink       = $( '#set-img-link' );
        $openImgFile      = $( '#open-img-file' );
        $infoImgFile      = $( '#info-img-file' );
        $windToggle       = $( '#wind-toggle' );

        //
        // Add event handlers
        //

        // Load flag image from hash on user entered hash
        $( window ).on( 'popstate', fromHash );

        // Determine file loading mode
        $setImgUploadMode.on( 'change', function () {
            var mode = $setImgUploadMode.val();
            if ( mode === 'web' ) {
                $controlImgUpload.addClass( 'upload-mode-web' );
                $controlImgUpload.removeClass( 'upload-mode-file' );
            }
            else if ( mode === 'file' ) {
                $controlImgUpload.addClass( 'upload-mode-file' );
                $controlImgUpload.removeClass( 'upload-mode-web' );
            }
        } ).trigger( 'change' );

        // Load flag image from user given url
        $setImgLink.on( 'change', function () {
            toHash();
            setFlagOpts( { imgSrc : $setImgLink.val() } );
        } );

        // Load flag image from file
        $openImgFile.on( 'change', function () {
            var file   = $openImgFile[ 0 ].files[ 0 ],
                reader = new window.FileReader();
            reader.onload = function ( e ) {
                if ( $setImgLink.val() || getHashData() ) {
                    $setImgLink.val( '' );
                    toHash();
                }
                setFlagOpts( { imgSrc : e.target.result } );
                $infoImgFile.text( $openImgFile.val().split( '\\' ).pop() );
            };
            reader.readAsDataURL( file );
        } );

        //
        // Expandable controls
        //

        function setExpander ( $expander, $expandable ) {
            if ( $expandable.hasClass( 'expanded' ) ) {
                $expander.addClass( 'open' );
                $expander.removeClass( 'closed' );
            }
            else {
                $expander.addClass( 'closed' );
                $expander.removeClass( 'open' );
            }
        }

        $( '.expander' )
            .on( 'click', function () {
                var $this       = $( this ),
                    $expandable = $( $this.data( 'for' ) );
                $expandable.toggleClass( 'expanded' );
                setExpander( $this, $expandable );
            } )
            .each( function ( i, elem ) {
                var $elem = $( elem );
                setExpander(
                    $elem,
                    $( $elem.data( 'for' ) )
                );
            } );

        //
        // Settings
        //

        // Turn wind on or off
        $windToggle.on( 'change', function () {
            if ( this.checked ) {
                flagWaver.setWind( 300 );
            }
            else {
                flagWaver.setWind( 0 );
            }
        } );

        //
        // Init
        //

        // Init flagWaver and append renderer to DOM
        flagWaver.init();
        $( '.js-flag-canvas' ).append( flagWaver.canvas );
        window.dispatchEvent( new window.Event( 'resize' ) );

        // Load flag image from hash on page load
        fromHash();

    } );

}( window, document, jQuery, window.flagWaver ));
