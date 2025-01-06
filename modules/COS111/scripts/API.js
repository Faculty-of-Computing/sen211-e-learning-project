// document.addEventListener('DOMContentLoaded', () => {
//  document.getElementById("contentOne").addEventListener('click', fetchCourseContent("Introduction To COS111"));
// })

// console.log(document.getElementById("contentOne"))

async function fetchCourseContent(contentToFetch) {

// loading indicator
  document.getElementById('loadingIndicator').style.display = 'flex';
  document.getElementById('loading-icon').style.display='flex'
  document.getElementById('error').style.display='none'

    try {
      const response = await fetch('https://cos1.vercel.app/api/content');
  
      if (response.ok) {
        const data = await response.json();
        // const courseData = data.course_data;
        // const keys = Object.keys(courseData);
        // console.log(data);
        // console.log(response);
        document.getElementById('loading-icon').style.display='flex'

        console.log('Course Content:', data[contentToFetch].content);
        localStorage.setItem("Content", JSON.stringify(data[contentToFetch].content));

         // Hid the loading indicator once the content is fetched
         document.getElementById('loadingIndicator').style.display = 'none';

        // window.location.href = "../../lessons/details.html";
        window.location.href= "../COS111/lessons/details.html";
      } else {
        console.error('Failed to fetch course content:', await response.json());
        document.getElementById('loading-icon').style.display='none'

                 document.getElementById('loadingIndicator').style.display = 'flex';
                 document.getElementById('error').style.display='flex'


      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('loadingIndicator').style.display = 'flex';
      document.getElementById('loading-icon').style.display='none'

      document.getElementById('error').style.display='flex'


    }
  }

//   async function fetchCourseContent1 () {
//     await fetchCourseContent("Introduction To COS111");
//   }


// buttons.addEventListener('click', fetchCourseContent1);

//   fetchCourseContent();