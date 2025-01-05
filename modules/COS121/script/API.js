// document.addEventListener('DOMContentLoaded', () => {
//  document.getElementById("contentOne").addEventListener('click', fetchCourseContent("Introduction To COS111"));
// })

// console.log(document.getElementById("contentOne"))

async function fetchCourseContent(contentToFetch) {
    try {
      const response = await fetch('https://cos1.vercel.app/api/content');
  
      if (response.ok) {
        const data = await response.json();
        // const courseData = data.course_data;
        // const keys = Object.keys(courseData);
        // console.log(data);
        // console.log(response);
        console.log('Course Content:', data[contentToFetch].content);
        localStorage.setItem("Content", JSON.stringify(data[contentToFetch].content));
        window.location.href = "./lessons/details.html";
      } else {
        console.error('Failed to fetch course content:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

//   async function fetchCourseContent1 () {
//     await fetchCourseContent("Introduction To COS111");
//   }


// buttons.addEventListener('click', fetchCourseContent1);

//   fetchCourseContent();