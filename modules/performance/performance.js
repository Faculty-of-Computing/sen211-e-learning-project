// @ts-check
import "/lib/chart.js";
import { getUser, getUserResults } from "/scripts/firebase.js";

await new Promise((res) => {
  document.addEventListener("DOMContentLoaded", res);
});

const loader = /** @type {HTMLDivElement} */ (
  document.getElementById("loader")
);

const info = document.createElement("div");
info.classList.add("text-xl", "font-afacad");

const infoText = info.appendChild(document.createElement("span"));
infoText.innerText = `It seems you've not taken any quizzes 🤔`;
info.appendChild(document.createElement("br"));

const infoAnchor = info.appendChild(document.createElement("a"));
infoAnchor.innerText = "Try one?";
infoAnchor.href = "/";
infoAnchor.classList.add("text-primary", "underline");

if (!localStorage.getItem("user-id")) {
  infoText.innerText = `You're not signed in 😓`;
  infoAnchor.innerText = "Login?";
  infoAnchor.href = "/auth/login.html";
  loader.replaceWith(info);
  throw new Error("User not signed in!");
}

getUser(({ photoURL, displayName }) => {
  const userSlug = /** @type {HTMLDivElement} */ (
    document.querySelector("#user-slug")
  );
  if (photoURL) {
    const img = /** @type {HTMLImageElement} */ (userSlug.querySelector("img"));
    img.classList.remove("hidden");
    img.src = photoURL;
  } else if (displayName) {
    const userName = /** @type {HTMLDivElement} */ (
      userSlug.querySelector("div")
    );
    userName.classList.remove("hidden");
    userName.classList.add("flex");
    userName.innerText = displayName
      .split(" ")
      .map((name) => name[0].toUpperCase())
      .join("");
  }
});

/** @param {number} duration  */
function calcDuration(duration) {
  return `${Math.floor(duration / 60)
    .toString()
    .padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}`;
}
/** @param {string} className  */
function unhide(className) {
  if (loader) loader.remove();
  Array.from(
    /** @type {HTMLCollectionOf<HTMLElement>} */ (
      document.getElementsByClassName(className)
    )
  ).forEach((el) => {
    el.classList.remove(className);
  });
}

const url = new URL(location.href);

const resultsPromise = getUserResults();

/** @type {string} */
let idFromResult;

if (
  url.searchParams.has("score") &&
  url.searchParams.has("total") &&
  url.searchParams.has("id") &&
  url.searchParams.has("duration") &&
  url.searchParams.has("course")
) {
  idFromResult = /** @type {string} */ (url.searchParams.get("id"));
  drawPerformanceTable({
    score: +(/** @type {string} */ (url.searchParams.get("score"))),
    total: +(/** @type {string} */ (url.searchParams.get("total"))),
    duration: +(/** @type {string} */ (url.searchParams.get("duration"))),
    course: /** @type {string} */ (url.searchParams.get("course")),
  });
} else {
  resultsPromise.then(async (results) => {
    if (!results.length) return loader.replaceWith(info);
    const data = results.reduce(
      (result, current) => {
        // score, total, duration, course
        result.score += current.score;
        result.total += current.total;
        result.duration += current.duration;
        return result;
      },
      {
        score: 0,
        duration: 0,
        total: 0,
        course: "Learnify",
      }
    );
    drawPerformanceTable(data);
  });
}

/** @param {Result} param0 */
async function drawPerformanceTable({ course, score, duration, total }) {
  const performanceTableContainer = /** @type {HTMLDivElement} */ (
    document.getElementById("performance-table")
  );
  performanceTableContainer.style.display = "";
  const average = ((score / total) * 100).toFixed();
  const user = await getUser();
  unhide("unhide-table");
  const timeTaken = calcDuration(duration);
  performanceTableContainer.innerHTML = `
      <h4 class="font-afacad text-[48px] font-bold leading-[35px] tracking-[-0.03em] text-left  text-primary">
        ${user.displayName}
      </h4>
      <table id="performance">
        <tbody>
          <tr>
            <td>Your score</td>
            <td>
              ${score}/${total}
            </td>
          </tr>
          <tr>
            <td>Your average</td>
            <td>${average}%</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>${timeTaken}</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>${course}</td>
          </tr>
          <tr>
            <td>Questions</td>
            <td>${total}</td>
          </tr>
        </tbody>
      </table>
      <div class="md:space-x-[15px] mt-2 flex md:block flex-col gap-2">
        <span class="font-afacad font-semibold text-[24px] leading-[32px] text-primary">
          Quiz Evaluation:
        </span>
        <span class="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
          Attempted: ${total}
        </span>
        <span class="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
          Passed: ${score}
        </span>
        <span class="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
          Failed: ${+total - score}
        </span>
      </div>
      `;

  /**
   * @typedef {object} StatCardProps
   * @property {string} title
   * @property {string} content
   * @property {number=} value
   * @property {number=} max
   * @param {StatCardProps} data
   */
  function startCard(data) {
    const id = Math.random();
    queueMicrotask(() => {
      if (!data.max || !data.value) return;
      const canvas = document.getElementById(id.toString());
      // @ts-expect-error ...
      // eslint-disable-next-line no-undef
      new Chart(canvas, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [data.value, data.max - data.value],
              backgroundColor: ["#FF9500", "#141617"],
              hoverOffset: 4,
              borderWidth: 0,
              borderColor: "transparent",
            },
          ],
        },
      });
    });
    return `
      <div class="size-[251px] box-border flex items-center justify-center p-[21px_15px] gap-[32px] bg-[#1D1F21]  rounded-[20px] xl:rounded-none relative">
        <span class="absolute font-afacad font-semibold text-[24px] leading-[32px] text-white top-3 left-0 right-0 w-full text-center inline-block">
          ${data.title}
        </span>
        <div class="size-[125px] relative before:content-[''] before:size-full before:bg-black before:opacity-30 before:border-[2px_solid_black] before:rounded-full before:absolute before:-z-10 z-0 font-afacad text-semibold text-white flex justify-center items-center">
          <canvas id="${id}" class="-mt-2.5"></canvas>
          <span class="absolute capitalize text-lg">${data.content}</span>
        </div>
      </div>
          `;
  }

  const startCardContainer = /** @type {HTMLDivElement} */ (
    document.getElementById("stat-cards")
  );
  startCardContainer.innerHTML += [
    startCard({
      content: `${average}%`,
      title: "Average",
      max: 100,
      value: +average,
    }),
    startCard({
      content: `${score}/${total}`,
      title: "Score",
      max: +total,
      value: +score,
    }),
    startCard({
      // FIXME
      content: calcDuration(duration),
      title: "Duration",
    }),
  ].join(" ");
}

const results = await resultsPromise;
const rows = results
  .sort((a, b) => b.time.toDate().getTime() - a.time.toDate().getTime())
  .reduce((results, result) => {
    if (result.id === idFromResult) return results;
    const average = (result.score / result.total) * 100;
    const time = result.time.toDate();

    /** @type {string} */
    let className,
      /** @type {string} */
      text;
    if (+average >= 80) {
      className = "text-[#05C612]";
      text = "Great";
    } else if (+average >= 50) {
      className = "text-[#EFE009]";
      text = "Good";
    } else {
      className = "text-[#C61805]";
      text = "Poor";
    }
    results.push(`
      <span>
      ${time.getDate().toString().padStart(2, "0")} / 
      ${(time.getMonth() + 1).toString().padStart(2, "0")} /
        ${time.getFullYear().toString().slice(2)}
      </span>
      <span>${result.course}</span>
      <span>${result.score}/${result.total}</span>
      <span class="${className}">
        ${text}
      </span>
    `);
    return results;
  }, /** @type {string[]} */ ([]));

if (rows.length) {
  unhide("unhide-history");
  const historyFieldContainer = /** @type {HTMLDivElement} */ (
    document.getElementById("history-fields")
  );
  historyFieldContainer.innerHTML = rows.join(" ");
}
