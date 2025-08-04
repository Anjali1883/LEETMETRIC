document.addEventListener("DOMContentLoaded", function(){


    const searchButton=document.getElementById("search-btn");
    const userNameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgress=document.querySelector(".easy-progress");
    const mediumProgress=document.querySelector(".medium-progress");
    const hardProgress=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");


    //return true or false based on a regex
    function validateUserName(username){
        if(username.trim() === ""){
            alert("USERNAME SHOULD NOT BE EMPTY");
            return false;
        }
        const regex= /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;

        const isMatching=regex.test(username);
        if(!isMatching){
            return "invalid username!";
        }
        return isMatching;

    }

    async function fetchUserDetails(username){

        try{
            searchButton.textContent="Searching...";
            searchButton.disabled= true;

            const proxyUrl= 'https://cors-anywhere.herokuapp.com/';
                
            const url='https://leetcode.com/graphql/';

            const myHeaders=new Headers();
            myHeaders.append("content-type","application/json");
        
            const graphql= JSON.stringify({
                query:`\n    query userSessionProgress($username: String!) 
                    {\n  allQuestionsCount {\n    difficulty\n    count\n  }
                    \n  matchedUser(username: $username){\n    submitStats 
                    {\n      acSubmissionNum {\n        difficulty\n        count\n        
                    submissions\n      }\n totalSubmissionNum {\n        difficulty\n        count\n      
                    submissions\n      }\n    }\n  }\n}\n    `,
                variables: {"username": `${username}`}

            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            }

            const response= await fetch(proxyUrl+url, requestOptions);

            if(!response.ok){
                    throw new Error("Unable to fetch the user details");
            }
            const data= await response.json();
            const acSubmissionNum = data?.data?.matchedUser?.submitStats?.acSubmissionNum||[];

            acSubmissionNum.forEach((item) => {
                const difficulty = item.difficulty.toLowerCase(); // "easy", "medium", "hard"
                const count = item.count;
                const total= item.allQuestionsCOunt;

                // Calculate progress percentage
                const progressPercentage = (count/total)*100; 

                // Select the circle and label based on difficulty
                const progressCircle = document.querySelector(`.${difficulty}-progress`);
                const progressLabel = document.getElementById(`${difficulty}-label`);

                if (progressCircle) {
                    // Update the circle's CSS gradient (green portion)
                    progressCircle.style.setProperty('--progress-degree', `${progressPercentage * 3.6}deg`);
                }
                if (progressLabel) {
                    // Update the label to show the count
                    progressLabel.textContent = `${count}`;
                }
            });

                

        }catch (error) {
            console.error("Error fetching user details:", error);
            statsContainer.innerHTML = '<p>No data found!</p>';
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    searchButton.addEventListener('click', function(){
        const username= userNameInput.value;
        console.log("logging in ", username);
        
        if(validateUserName(username)){
            fetchUserDetails(username);
        }
    })
})