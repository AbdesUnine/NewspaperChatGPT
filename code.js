	document.querySelector('.hoverable').addEventListener('mouseover', function() {
		pushToHoverData(1);
	});
	
	document.querySelector('.hoverable2').addEventListener('mouseover', function() {
		pushToHoverData(2);
	});
	
	document.querySelector('.hoverable3').addEventListener('mouseover', function() {
		pushToHoverData(3);
	});
	
	document.querySelector('.hoverable4').addEventListener('mouseover', function() {
		pushToHoverData(4);
	});
	
	document.querySelector('.hoverable7').addEventListener('mouseover', function() {
		pushToHoverData(5);
	});

	document.querySelector('.hoverable8').addEventListener('mouseover', function() {
		pushToHoverData(6);
	});

	document.querySelector('.hoverable9').addEventListener('mouseover', function() {
		pushToHoverData(7);
	});
	
	document.querySelector('.hoverable16').addEventListener('mouseover', function() {
		pushToHoverData(8);
	});
	
	document.querySelector('.hoverable17').addEventListener('mouseover', function() {
		pushToHoverData(9);
	});
	
	document.querySelector('.hoverable18').addEventListener('mouseover', function() {
		pushToHoverData(10);
	});
	
	document.querySelector('.hoverable19').addEventListener('mouseover', function() {
		pushToHoverData(11);
	});
	
	document.querySelector('.hoverable20').addEventListener('mouseover', function() {
		pushToHoverData(12);
	});
	
	document.querySelector('.hoverable21').addEventListener('mouseover', function() {
		pushToHoverData(13);
	});
	
	document.querySelector('.hoverable10').addEventListener('mouseover', function() {	
		pushToHoverData(14);
	});
	
	document.querySelector('.hoverable11').addEventListener('mouseover', function() {
		pushToHoverData(15);
	});
	
	document.querySelector('.hoverable12').addEventListener('mouseover', function() {
		pushToHoverData(16);
	});
	
	document.querySelector('.hoverable13').addEventListener('mouseover', function() {
		pushToHoverData(17);
	});
	
	document.querySelector('.hoverable14').addEventListener('mouseover', function() {
		pushToHoverData(18);
	});
	
	document.querySelector('.hoverable15').addEventListener('mouseover', function() {
		pushToHoverData(19);
	});

	document.querySelector('.hoverable40').addEventListener('mouseover', function() {
		pushToHoverData(20);
	});
	
	document.querySelector('.hoverable41').addEventListener('mouseover', function() {
		pushToHoverData(21);
	});

	function pushToHoverData(id_){
		hoverData.push(id_);
	}
	
	function calculateTimeOnSite() {
            var endTime = new Date();
            var timeSpent = endTime - startTime; // Time in milliseconds

            // Convert milliseconds to seconds
            var timeSpentSeconds = Math.floor(timeSpent / 1000);

            return timeSpentSeconds;
    }
	
	function getSpecificQueryParams() {
        let params = {};
        let queryString = window.location.search.substring(1);
        let regex = /([^&=]+)=([^&]*)/g;
        let m;
        let desiredParams = ['PROLIFIC_PID', 'QUALTRICS_ID', 'STUDY_ID', 'SESSION_ID', 'GROUP'];
        while (m = regex.exec(queryString)) {
            let paramName = decodeURIComponent(m[1]);
            if (desiredParams.includes(paramName)) {
                params[paramName] = decodeURIComponent(m[2]);
            }
        }
        return params;
    }

    function redirectToQualtrics() {
		if (typeof startTime !== 'undefined') {
			let params = getSpecificQueryParams();
			let baseUrl = 'https://neuchatel.eu.qualtrics.com/jfe/form/SV_82M8s9tu2Mv2GP4';
			let timeSpent = calculateTimeOnSite();
			if (timeSpent > 10){
				params['timeSpent'] = timeSpent;
				// Add hover data to the params
				params['hoverData'] = JSON.stringify(hoverData);
				let queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
				let url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
				window.location.href = url;
			}else{
				alert('Veuillez passer plus de temps sur le site');
			}
		} else {
			alert('Veuillez passer plus de temps sur le site');
		}
    }