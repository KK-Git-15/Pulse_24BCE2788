/* ===========================
   DATA
=========================== */
const data = {
  followers: 12540,
  engagement: "78%",
  growth: "+12%",
  growthData: [2000, 3500, 5200, 7800, 10200, 12540],
  posts: [
    { title: "AI Content Post",  likes: 540, comments: 120 },
    { title: "Travel Reel",      likes: 430, comments: 98  },
    { title: "Tech Tips",        likes: 390, comments: 75  },
    { title: "Motivation Post",  likes: 300, comments: 60  }
  ],
  scheduled: [
    { title: "AI Reel",        date: "Mar 30", status: "Scheduled" },
    { title: "Tech Carousel",  date: "Apr 02", status: "Draft"     },
    { title: "Travel Post",    date: "Apr 05", status: "Scheduled" },
    { title: "Product Post",   date: "Apr 08", status: "Review"    }
  ],
  platforms: [
    { name: "Instagram", value: 45, color: "#e1306c" },
    { name: "YouTube",   value: 30, color: "#ff0000" },
    { name: "Twitter",   value: 15, color: "#1da1f2" },
    { name: "LinkedIn",  value: 10, color: "#0a66c2" }
  ],
  monthlyEngagement: [1200, 1900, 3000, 5000, 4200, 6100]
};

/* ===========================
   THEME
=========================== */
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.getElementById("themeToggle").onclick = () =>
  setTheme(!document.body.classList.contains("dark"));

document.getElementById("themeToggle2").onclick = () =>
  setTheme(!document.body.classList.contains("dark"));

/* ===========================
   DATE PILL
=========================== */
const now = new Date();
document.getElementById("datePill").textContent =
  now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ===========================
   NAVIGATION
=========================== */
const navItems  = document.querySelectorAll(".nav-item");
const sections  = document.querySelectorAll(".section");
const breadcrumb = document.getElementById("breadcrumbActive");

const sectionTitles = {
  overview:  "Overview",
  analytics: "Analytics",
  posts:     "Posts",
  settings:  "Settings"
};

navItems.forEach(item => {
  item.onclick = () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    sections.forEach(s => s.classList.add("hidden"));
    document.getElementById(item.dataset.section).classList.remove("hidden");
    breadcrumb.textContent = sectionTitles[item.dataset.section] || "";
  };
});

/* ===========================
   COMPUTE STATS
=========================== */
let totalLikes = 0, totalComments = 0;
data.posts.forEach(p => { totalLikes += p.likes; totalComments += p.comments; });
const avgLikesVal    = Math.round(totalLikes / data.posts.length);
const avgCommentsVal = Math.round(totalComments / data.posts.length);
const maxLikes       = Math.max(...data.posts.map(p => p.likes));

/* ===========================
   FILL KPI VALUES
=========================== */
document.getElementById("followers").textContent  = data.followers.toLocaleString();
document.getElementById("engagement").textContent = data.engagement;
document.getElementById("growth").textContent     = data.growth;
document.getElementById("avgLikesOv").textContent = avgLikesVal;
document.getElementById("totalPosts").textContent = data.posts.length;
document.getElementById("avgLikes").textContent   = avgLikesVal;
document.getElementById("avgComments").textContent = avgCommentsVal;

/* ===========================
   CHART HELPERS
=========================== */
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.font.size   = 12;

const gridCol  = () => document.body.classList.contains("dark")
  ? "rgba(255,255,255,0.06)"
  : "rgba(0,0,0,0.06)";
const tickCol  = () => document.body.classList.contains("dark")
  ? "#475569" : "#9ca3af";

const chartOpts = (extraScales = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: gridCol() },
      ticks: { color: tickCol() },
      border: { display: false },
      ...extraScales.x
    },
    y: {
      grid: { color: gridCol() },
      ticks: { color: tickCol() },
      border: { display: false },
      ...extraScales.y
    }
  }
});

/* ===========================
   GROWTH CHART
=========================== */
new Chart(document.getElementById("growthChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Followers",
      data: data.growthData,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.08)",
      borderWidth: 2.5,
      pointBackgroundColor: "#3b82f6",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.45
    }]
  },
  options: {
    ...chartOpts(),
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#9ca3af",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8
      }
    }
  }
});

/* ===========================
   PLATFORM DONUT (Overview)
=========================== */
const platColors = data.platforms.map(p => p.color);

new Chart(document.getElementById("platformDonut"), {
  type: "doughnut",
  data: {
    labels: data.platforms.map(p => p.name),
    datasets: [{
      data: data.platforms.map(p => p.value),
      backgroundColor: platColors,
      borderWidth: 0,
      hoverOffset: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: { legend: { display: false } }
  }
});

// Legend
const dl = document.getElementById("donutLegend");
data.platforms.forEach(p => {
  dl.innerHTML += `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${p.color}"></span>
      ${p.name} <strong style="margin-left:2px;color:var(--text)">${p.value}%</strong>
    </div>`;
});

/* ===========================
   MONTHLY ENGAGEMENT CHART
=========================== */
new Chart(document.getElementById("monthlyChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Engagement",
      data: data.monthlyEngagement,
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.08)",
      borderWidth: 2.5,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.45
    }]
  },
  options: {
    ...chartOpts(),
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#9ca3af",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8
      }
    }
  }
});

/* ===========================
   ENGAGEMENT DONUT (Analytics)
=========================== */
new Chart(document.getElementById("engagementChart"), {
  type: "doughnut",
  data: {
    labels: ["Likes", "Comments"],
    datasets: [{
      data: [totalLikes, totalComments],
      backgroundColor: ["#3b82f6", "#10b981"],
      borderWidth: 0,
      hoverOffset: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: { legend: { display: false } }
  }
});

const el = document.getElementById("engLegend");
[["#3b82f6","Likes",totalLikes],["#10b981","Comments",totalComments]].forEach(([c,l,v]) => {
  el.innerHTML += `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${c}"></span>
      ${l} <strong style="margin-left:2px;color:var(--text)">${v}</strong>
    </div>`;
});

/* ===========================
   PLATFORM BAR CHART (Analytics)
=========================== */
new Chart(document.getElementById("platformChart"), {
  type: "bar",
  data: {
    labels: data.platforms.map(p => p.name),
    datasets: [{
      label: "Share (%)",
      data: data.platforms.map(p => p.value),
      backgroundColor: data.platforms.map(p => p.color),
      borderRadius: 6,
      borderSkipped: false,
      borderWidth: 0
    }]
  },
  options: {
    ...chartOpts({ x: { grid: { display: false } } }),
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#9ca3af",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: ctx => ` ${ctx.raw}% of traffic` }
      }
    }
  }
});

/* ===========================
   POSTS TABLE
=========================== */
data.posts
  .slice()
  .sort((a, b) => b.likes - a.likes)
  .forEach((post, i) => {
    let perf = "low", label = "Low";
    if (post.likes > 500) { perf = "high";   label = "High";   }
    else if (post.likes > 350) { perf = "medium"; label = "Medium"; }

    const engPct = Math.round((post.likes / maxLikes) * 100);

    document.getElementById("topPosts").innerHTML += `
      <tr>
        <td><span class="rank-num">#${i + 1}</span></td>
        <td><span class="post-strong">${post.title}</span></td>
        <td>${post.likes.toLocaleString()}</td>
        <td>${post.comments}</td>
        <td>
          <div class="eng-wrap">
            <div class="eng-bar"><div class="eng-fill" style="width:${engPct}%"></div></div>
            <span class="eng-pct">${engPct}%</span>
          </div>
        </td>
        <td><span class="badge ${perf}">${label}</span></td>
      </tr>`;
  });

/* ===========================
   SCHEDULED POSTS
=========================== */
data.scheduled.forEach(post => {
  const statusClass = post.status.toLowerCase();
  document.getElementById("scheduledPosts").innerHTML += `
    <div class="sched-card">
      <p class="sched-title">${post.title}</p>
      <p class="sched-date">&#128197; ${post.date}</p>
      <span class="sched-status ${statusClass}">${post.status}</span>
    </div>`;
});
