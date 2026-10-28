const journey = document.querySelector("[data-fj-scroll]");

if (journey) {
  const root = journey.querySelector(".fj-sticky");
  const canvas = journey.querySelector("[data-fj-canvas]");
  const screen = journey.querySelector("[data-fj-screen]");
  const routes = [...journey.querySelectorAll("[data-fj-route]")];
  const nodes = [...journey.querySelectorAll("[data-fj-node]")];
  const chapterLabels = [...journey.querySelectorAll(".fj-chapters span")];
  const isMobileJourney = window.matchMedia("(max-width: 820px)").matches;
  const mobileRoute = journey.querySelector("[data-fj-mobile-route]");
  const mobileProcess = journey.querySelector("[data-fj-mobile-process]");
  const token = document.createElement("div");
  token.className = "fj-token";
  token.innerHTML = "<strong>Record</strong><small>Moving</small>";
  canvas.append(token);

  const $ = (selector) => journey.querySelector(selector);
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const smooth = (from, to, value) => {
    const x = clamp((value - from) / (to - from));
    return x * x * (3 - 2 * x);
  };
  const badge = (text, tone = "") =>
    `<span class="fj-badge ${tone}">${text}</span>`;
  const field = (label, value, wide = false) =>
    `<div class="fj-field${wide ? " wide" : ""}"><span>${label}</span><strong>${value}</strong></div>`;
  const toolbar = (title, detail, action) =>
    `<div class="fj-toolbar"><div><strong>${title}</strong><small>${detail}</small></div>${action ? `<span class="fj-button">${action}</span>` : ""}</div>`;
  const person = () =>
    `<div class="fj-person"><img src="/assets/meera-sharma-demo.png" alt=""><div><strong>Meera Sharma</strong><small>Fictional candidate - CAN-1048</small></div></div>`;
  const panel = (title, content) =>
    `<section class="fj-panel"><div class="fj-panel-head"><strong>${title}</strong></div>${content}</section>`;

  const views = {
    role: () =>
      `${toolbar("New requirement", "REQ-0274 - Recruitment workspace", "Save draft")}<div class="fj-grid">${field("Role", "Payroll Operations Analyst", true)}${field("Location", "Gurugram")}${field("Experience", "3+ years")}${field("Skills", "Payroll operations, statutory compliance, Excel", true)}</div>`,
    published: () =>
      `${toolbar("Payroll Operations Analyst", "REQ-0274 - Published", "View posting")}<div class="fj-kpis"><div><span>Publishing state</span><strong>Live</strong></div><div><span>Channels</span><strong>03</strong></div><div><span>Applications</span><strong>0</strong></div></div>${panel("Connected sourcing channels", `<table class="fj-table"><tbody><tr class="is-hot"><td>Company careers portal</td><td>${badge("Published", "green")}</td></tr><tr><td>Recruiter sourcing</td><td>${badge("Shared")}</td></tr><tr><td>Employee referrals</td><td>${badge("Open")}</td></tr></tbody></table>`)}`,
    application: () =>
      `${toolbar("Applications", "REQ-0274 - Payroll Operations Analyst", "Review")}<div class="fj-kpis"><div><span>New</span><strong>12</strong></div><div><span>In review</span><strong>04</strong></div><div><span>Shortlisted</span><strong>02</strong></div></div>${panel("Candidate queue", `<table class="fj-table"><thead><tr><th>Candidate</th><th>Source</th><th>Status</th></tr></thead><tbody><tr class="is-hot"><td>${person()}</td><td>Careers portal</td><td>${badge("New", "amber")}</td></tr><tr><td>Arjun Mehta</td><td>Referral</td><td>${badge("In review")}</td></tr></tbody></table>`)}`,
    sources: () =>
      `${toolbar("Publishing activity", "REQ-0274 - Connected channels", "Refresh")}<div class="fj-kpis"><div><span>Careers portal</span><strong>Live</strong></div><div><span>Recruiter</span><strong>Shared</strong></div><div><span>Referrals</span><strong>Open</strong></div></div>${panel("Latest activity", `<table class="fj-table"><tbody><tr class="is-hot"><td>Company careers portal</td><td>Posting synced</td><td>${badge("Complete", "green")}</td></tr><tr><td>Recruiter sourcing</td><td>Role brief sent</td><td>${badge("Complete", "green")}</td></tr><tr><td>Employee referrals</td><td>Referral window enabled</td><td>${badge("Complete", "green")}</td></tr></tbody></table>`)}`,
    criteria: () =>
      `${toolbar("Candidate evidence", "Meera Sharma - CAN-1048", "Open profile")}<div class="fj-grid"><div>${person()}<div class="fj-document"><div><strong>Meera_Sharma_Resume.pdf</strong><small>Uploaded from careers portal</small></div></div></div><div class="fj-score"><strong>86</strong><div><span>Configured match</span><small>Evidence for recruiter review</small></div></div></div>`,
    shortlist: () =>
      `${toolbar("Evaluation", "Meera Sharma - CAN-1048", "Move forward")}<div class="fj-grid"><div>${person()}</div><ul class="fj-checks"><li>Payroll operations experience</li><li>Statutory compliance exposure</li><li>Advanced spreadsheet skills</li><li>Location preference</li></ul></div><div class="fj-toast"><strong>Recommended for human review</strong><small>Configured criteria support the recruiter; they do not make the hiring decision.</small></div>`,
    calendar: () =>
      `${toolbar("Interview schedule", "Meera Sharma - CAN-1048", "Send invitation")}<div class="fj-grid">${field("Interview panel", "Kavita Rao, Rohan Sen", true)}${field("Date", "18 Aug 2026")}${field("Time", "10:30 - 11:15")}${field("Mode", "Microsoft Teams")}${field("Candidate availability", "Confirmed")}</div>`,
    invited: () =>
      `${toolbar("Interview schedule", "INT-1048 - Payroll Operations Analyst", "Open meeting")}<div class="fj-kpis"><div><span>Candidate</span><strong>Confirmed</strong></div><div><span>Panel</span><strong>Notified</strong></div><div><span>Calendar</span><strong>Reserved</strong></div></div><div class="fj-toast"><strong>Invitation sent</strong><small>Candidate and interview panel received the same schedule.</small></div>`,
    offer: () =>
      `${toolbar("Joining queue", "Meera Sharma - Offer accepted", "Start onboarding")}<div class="fj-kpis"><div><span>Offer</span><strong>Accepted</strong></div><div><span>Joining date</span><strong>02 Sep</strong></div><div><span>Checklist</span><strong>0 / 5</strong></div></div>${panel("Candidate conversion", `<table class="fj-table"><tbody><tr class="is-hot"><td>${person()}</td><td>Payroll Operations Analyst</td><td>${badge("Ready to onboard", "green")}</td></tr></tbody></table>`)}`,
    documents: () =>
      `${toolbar("Onboarding checklist", "Meera Sharma - Joining 02 Sep", "Request documents")}<div class="fj-grid"><ul class="fj-checks"><li>Identity proof</li><li>Bank details</li><li>Tax declaration</li><li>Education records</li></ul><div><div class="fj-document"><div><strong>Identity_proof.pdf</strong><small>Verified upload</small></div></div><div class="fj-document"><div><strong>Bank_details.pdf</strong><small>Verified upload</small></div></div></div></div>`,
    employee: () =>
      `${toolbar("Employee profile", "EMP-2048 - Active", "View employee")}<div class="fj-grid"><div>${person()}<div class="fj-kpis" style="grid-template-columns:1fr"><div><span>Employee ID</span><strong>EMP-2048</strong></div></div></div><div>${field("Manager", "Kavita Rao", true)}${field("Client", "Northstar Services", true)}${field("Work location", "Gurugram", true)}</div></div><div class="fj-toast"><strong>Employee record created</strong><small>Candidate history remains connected to EMP-2048.</small></div>`,
    access: () =>
      `${toolbar("Access provisioning", "Meera Sharma - EMP-2048", "Review access")}<div class="fj-kpis"><div><span>Employee self-service</span><strong>Enabled</strong></div><div><span>Manager view</span><strong>Assigned</strong></div><div><span>Policy</span><strong>Standard Flex</strong></div></div>${panel("Access map", `<table class="fj-table"><tbody><tr class="is-hot"><td>Meera Sharma</td><td>ESS portal</td><td>${badge("Active", "green")}</td></tr><tr><td>Kavita Rao</td><td>Manager self-service</td><td>${badge("Team visible", "green")}</td></tr></tbody></table>`)}`,
    attendanceMobile: () =>
      `${toolbar("Live attendance intake", "Meera Sharma - EMP-2048", "Open record")}<div class="fj-kpis"><div><span>Source</span><strong>Mobile</strong></div><div><span>Check-in</span><strong>09:04</strong></div><div><span>Location</span><strong>Office</strong></div></div>${panel("Incoming attendance data", `<table class="fj-table"><thead><tr><th>Employee</th><th>Source</th><th>Time</th><th>Status</th></tr></thead><tbody><tr class="is-hot"><td>Meera Sharma</td><td>Mobile app</td><td>09:04</td><td>${badge("Received", "green")}</td></tr></tbody></table>`)}`,
    attendanceBiometric: () =>
      `${toolbar("Live attendance intake", "Multiple attendance sources", "Review inputs")}<div class="fj-kpis"><div><span>Mobile records</span><strong>01</strong></div><div><span>Biometric records</span><strong>01</strong></div><div><span>Unmatched</span><strong>00</strong></div></div>${panel("Attendance source register", `<table class="fj-table"><thead><tr><th>Employee</th><th>Source</th><th>Timestamp</th><th>Status</th></tr></thead><tbody><tr><td>Meera Sharma</td><td>Mobile app</td><td>09:04</td><td>${badge("Received", "green")}</td></tr><tr class="is-hot"><td>Meera Sharma</td><td>Biometric device</td><td>18:07</td><td>${badge("Received", "green")}</td></tr></tbody></table>`)}`,
    policy: () =>
      `${toolbar("Attendance policy", "Standard Flex - Gurugram", "Preview rule")}<div class="fj-grid">${field("Shift start", "09:00")}${field("Grace period", "10 minutes")}${field("Recorded arrival", "09:04")}${field("Rule result", "Within grace")}</div><div class="fj-toast"><strong>Policy applied</strong><small>The recorded attendance remains visible with its source and evaluated result.</small></div>`,
    payroll: () =>
      `${toolbar("October 2026 payroll", "Northstar Services - Monthly India", "Finalise payroll")}<div class="fj-kpis"><div><span>Employees</span><strong>128</strong></div><div><span>Inputs ready</span><strong>128</strong></div><div><span>Exceptions</span><strong>00</strong></div></div>${panel("Payroll review", `<table class="fj-table"><thead><tr><th>Employee</th><th>Attendance</th><th>Net pay</th><th>Status</th></tr></thead><tbody><tr class="is-hot"><td>${person()}</td><td>${badge("Reviewed", "green")}</td><td>&#8377;64,400</td><td>${badge("Ready", "green")}</td></tr></tbody></table>`)}`,
    payslip: () =>
      `${toolbar("Payroll outputs", "October 2026 - Finalised", "Publish outputs")}<div class="fj-grid"><div>${field("Gross earnings", "&#8377;70,000", true)}${field("Deductions", "&#8377;5,600", true)}${field("Net pay", "&#8377;64,400", true)}</div><ul class="fj-checks"><li>Payroll reviewed</li><li>Bank instruction generated</li><li>Payslip published</li></ul></div><div class="fj-toast"><strong>Payslip available in ESS</strong><small>Meera can securely view the authorised payroll output.</small></div>`,
  };

  const chapters = [
    {
      name: "Publish the role",
      eyebrow: "RECRUITMENT",
      role: "Recruiter",
      title: "Publish a requirement once.",
      status: "Role published",
      nav: ["Dashboard", "Open roles", "Applications", "Interviews"],
      active: 1,
      nodes: [
        ["JD", "Input", "Job description", "Role, skills and experience"],
        [
          "CP",
          "Channel",
          "Company careers portal",
          "Published from FrevOne",
          "/assets/careers-portal.png",
        ],
        ["RS", "Channel", "Recruiter sourcing", "The same approved role brief"],
        ["ER", "Channel", "Employee referrals", "Referral window enabled"],
        null,
      ],
      paths: [
        "M 220 320 C 280 320, 300 330, 360 330",
        "M 1030 235 C 1120 150, 1190 125, 1250 125",
        "M 1080 335 C 1160 335, 1190 345, 1250 345",
        "M 1030 445 C 1120 510, 1180 550, 1250 560",
        "",
      ],
      steps: [
        [
          "Job description enters FrevOne",
          "The approved requirement becomes one governed recruitment record.",
          "role",
          "JD",
          "REQ-0274",
        ],
        [
          "Publish to the company portal",
          "The role appears on the branded careers page without re-entry.",
          "published",
          "Role",
          "Published",
        ],
        [
          "Share with sourcing teams",
          "Recruiters receive the same role, skills and location context.",
          "sources",
          "Role brief",
          "Synced",
        ],
        [
          "Open employee referrals",
          "One approved requirement now serves every connected channel.",
          "application",
          "Referral",
          "Enabled",
        ],
      ],
    },
    {
      name: "Evaluate candidates",
      eyebrow: "ATS & INTERVIEWS",
      role: "Recruiter",
      title: "Turn applications into evidence.",
      status: "Candidate in review",
      nav: ["Applications", "Evaluation", "Interviews", "Offers"],
      active: 1,
      nodes: [
        [
          "MS",
          "Candidate",
          "Meera Sharma",
          "Applied from careers portal",
          "/assets/meera-sharma-demo.png",
        ],
        ["86", "ATS evidence", "Configured match", "Supports human review"],
        [
          "NT",
          "Communication",
          "Stakeholders notified",
          "Candidate and panel",
          "/assets/stakeholder-meeting.png",
          "people",
        ],
        [
          "IN",
          "Interview",
          "Availability confirmed",
          "18 Aug - 10:30",
          "/assets/interview-calendar.png",
        ],
        null,
      ],
      paths: [
        "M 220 320 C 280 320, 300 330, 360 330",
        "M 1030 235 C 1120 150, 1190 125, 1250 125",
        "M 1080 335 C 1160 335, 1190 345, 1250 345",
        "M 1030 445 C 1120 510, 1180 550, 1250 560",
        "",
      ],
      steps: [
        [
          "Candidate applies for the role",
          "Meera uploads her resume and becomes candidate CAN-1048.",
          "application",
          "Resume",
          "Uploaded",
        ],
        [
          "Evaluate against configured criteria",
          "FrevOne presents matched evidence; the recruiter keeps the decision.",
          "criteria",
          "Evidence",
          "86 / 100",
        ],
        [
          "Move the candidate forward",
          "Required evidence is reviewed before the candidate is shortlisted.",
          "shortlist",
          "Candidate",
          "Shortlisted",
        ],
        [
          "Coordinate the interview",
          "Availability, calendar and stakeholder notifications stay connected.",
          "invited",
          "Invite",
          "Confirmed",
        ],
      ],
    },
    {
      name: "Onboard the employee",
      eyebrow: "ONBOARDING",
      role: "HR administrator",
      title: "Carry the accepted candidate forward.",
      status: "Joining in progress",
      nav: ["Joining queue", "Documents", "Employees", "Access"],
      active: 0,
      nodes: [
        ["OK", "Selection", "Offer accepted", "Joining 02 Sep"],
        ["DC", "Documents", "Joining documents", "Secure employee upload"],
        [
          "ID",
          "Employee",
          "EMP-2048 created",
          "History retained",
          "/assets/employee-id.png",
        ],
        [
          "OF",
          "Workplace",
          "Ready for the first day",
          "ESS and manager access enabled",
          "/assets/office-building.png",
        ],
        null,
      ],
      paths: [
        "M 220 320 C 280 320, 300 330, 360 330",
        "M 1030 235 C 1120 150, 1190 125, 1250 125",
        "M 1080 335 C 1160 335, 1190 345, 1250 345",
        "M 1030 445 C 1120 510, 1180 550, 1250 560",
        "",
      ],
      steps: [
        [
          "Celebrate an accepted offer",
          "The accepted candidate enters a guided joining checklist.",
          "offer",
          "Offer",
          "Accepted",
        ],
        [
          "Collect and verify documents",
          "Meera sees exactly what to submit and HR sees what is complete.",
          "documents",
          "Documents",
          "Verified",
        ],
        [
          "Create the employee identity",
          "CAN-1048 becomes EMP-2048 without losing recruitment history.",
          "employee",
          "Identity",
          "EMP-2048",
        ],
        [
          "Enable self-service access",
          "The employee and manager receive the views relevant to their roles.",
          "access",
          "Access",
          "Enabled",
        ],
      ],
    },
    {
      name: "Run attendance & payroll",
      eyebrow: "WORKFORCE & PAYROLL",
      role: "Payroll administrator",
      title: "Bring reviewed work into payroll.",
      status: "October payroll",
      nav: ["Attendance", "Policies", "Payroll", "Outputs"],
      active: 2,
      nodes: [
        [
          "MB",
          "Mobile attendance",
          "Employee check-in",
          "Time and location captured",
          "/assets/attendance-mobile.png",
        ],
        [
          "PL",
          "Policy",
          "Standard Flex",
          "Rule applied consistently",
          "/assets/policy-document.png",
        ],
        [
          "BK",
          "Payroll output",
          "Secure bank instruction",
          "Generated after review",
          "/assets/payroll-output.png",
        ],
        [
          "PS",
          "Employee view",
          "Happy, informed teams",
          "Payslip available in ESS",
          "/assets/employee-group.png",
          "people",
        ],
        [
          "BIO",
          "Biometric attendance",
          "Office punch",
          "Device timestamp received",
          "/assets/biometric-device.png",
        ],
      ],
      nodeOrder: [0, 2, 3, 4, 1],
      stepRoutes: [0, 4, 1, 3],
      paths: [
        "M 220 245 C 285 250, 310 290, 380 300",
        "M 1030 235 C 1120 150, 1190 125, 1250 125",
        "M 1080 335 C 1160 335, 1190 345, 1250 345",
        "M 1030 445 C 1120 510, 1180 550, 1250 560",
        "M 220 470 C 285 465, 310 420, 380 405",
      ],
      steps: [
        [
          "Bring attendance inputs together",
          "A mobile check-in sends time and location to the employee register.",
          "attendanceMobile",
          "Time record",
          "Received",
        ],
        [
          "Receive the biometric punch",
          "The office device sends its own timestamp into the same register.",
          "attendanceBiometric",
          "Biometric",
          "Received",
        ],
        [
          "Apply policy before payroll review",
          "FrevOne evaluates both sources using the assigned attendance policy.",
          "policy",
          "Policy",
          "Applied",
        ],
        [
          "Publish the employee outcome",
          "A secure bank instruction and employee payslip become available.",
          "payslip",
          "Payslip",
          "Available",
        ],
      ],
    },
  ];

  const mobileStepLabels = [
    ["Create role", "Careers portal", "Sourcing", "Referrals"],
    ["Application", "ATS evidence", "Shortlist", "Interview"],
    ["Offer", "Documents", "Employee ID", "ESS access"],
    ["Mobile", "Biometric", "Policy", "Payslip"],
  ];
  const mobileStepNodes = [
    [0, 1, 2, 3],
    [0, 1, 1, 3],
    [0, 1, 2, 3],
    [0, 4, 1, 3],
  ];
  const mobileProcesses = [
    {
      eyebrow: "RECRUITMENT DISTRIBUTION",
      layout: "branch",
      nodes: [
        ["JD", "Upload job description", "Approved role and hiring criteria", "/assets/policy-document.png"],
        ["CP", "Company careers portal", "Published automatically", "/assets/careers-portal.png"],
        ["RS", "Recruiter sourcing", "Shared without re-entry", "/assets/stakeholder-meeting.png"],
        ["ER", "Employee referrals", "Referral channel enabled", "/assets/employee-group.png"],
      ],
      paths: [
        "M180 105 C150 132 80 132 56 190",
        "M180 105 L180 190",
        "M180 105 C210 132 280 132 304 190",
      ],
    },
    {
      eyebrow: "ATS & INTERVIEWS",
      layout: "vertical",
      nodes: [
        ["CV", "Candidate uploads resume", "Application record created", "/assets/meera-sharma-demo.png"],
        ["86", "ATS prepares match score", "Evidence against configured criteria", "/assets/policy-document.png"],
        ["SL", "Recruiter shortlists", "Human decision recorded", "/assets/employee-group.png"],
        ["IN", "Interview is scheduled", "Candidate and panel notified", "/assets/interview-calendar.png"],
      ],
      paths: ["M180 112 L180 178", "M180 238 L180 304", "M180 364 L180 430"],
    },
    {
      eyebrow: "GUIDED ONBOARDING",
      layout: "vertical",
      nodes: [
        ["OK", "Offer is accepted", "Joining workflow begins", "/assets/interview-calendar.png"],
        ["DC", "Documents are submitted", "HR verifies the checklist", "/assets/policy-document.png"],
        ["ID", "Employee ID is created", "Recruitment history stays connected", "/assets/employee-id.png"],
        ["ESS", "Self-service is enabled", "Employee and manager receive access", "/assets/office-building.png"],
      ],
      paths: ["M180 112 L180 178", "M180 238 L180 304", "M180 364 L180 430"],
    },
    {
      eyebrow: "ATTENDANCE TO PAYROLL",
      layout: "merge",
      nodes: [
        ["MB", "Mobile attendance", "Time and location received", "/assets/attendance-mobile.png"],
        ["BIO", "Biometric attendance", "Device timestamp received", "/assets/biometric-device.png"],
        ["PL", "Policy is applied", "Inputs evaluated consistently", "/assets/policy-document.png"],
        ["PS", "Payroll and payslip", "Reviewed outputs are published", "/assets/payroll-output.png"],
      ],
      paths: [
        "M92 126 C92 178 150 178 180 226",
        "M268 126 C268 178 210 178 180 226",
        "M180 292 L180 400",
      ],
    },
  ];

  const renderMobileProcess = (chapterIndex, stepIndex) => {
    if (!isMobileJourney || !mobileProcess) return;
    const process = mobileProcesses[chapterIndex];
    const connectorPaths = process.paths
      .map(
        (path, index) =>
          `<path class="${index + 1 <= stepIndex ? "is-visible" : ""}" d="${path}"></path>`,
      )
      .join("");
    const processNodes = process.nodes
      .map((node, index) => {
        const state =
          index < stepIndex
            ? "is-visible is-complete"
            : index === stepIndex
              ? "is-visible is-active"
              : "";
        const visual = node[3]
          ? `<img src="${node[3]}" alt="" loading="eager" decoding="async">`
          : `<span>${node[0]}</span>`;
        return `<article class="${state}" data-process-node="${index}">${visual}<div><strong>${node[1]}</strong><small>${node[2]}</small></div></article>`;
      })
      .join("");
    mobileProcess.className = `fj-mobile-process layout-${process.layout}`;
    mobileProcess.innerHTML = `
      <header><span>${process.eyebrow}</span><strong>${String(stepIndex + 1).padStart(2, "0")} / 04</strong></header>
      <div class="fj-process-map">
        <svg viewBox="0 0 360 520" preserveAspectRatio="none" aria-hidden="true">
          <defs><marker id="fj-mobile-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z"></path></marker></defs>
          ${connectorPaths}
        </svg>
        ${processNodes}
      </div>`;
  };

  let currentKey = "";
  let ticking = false;

  const renderChapter = (chapter) => {
    $("[data-fj-phase]").textContent = chapter.name;
    $("[data-fj-eyebrow]").textContent = chapter.eyebrow;
    $("[data-fj-role]").textContent = chapter.role;
    $("[data-fj-title]").textContent = chapter.title;
    $("[data-fj-status]").textContent = chapter.status;
    $("[data-fj-nav]").innerHTML = chapter.nav
      .map(
        (item, index) =>
          `<span class="${index === chapter.active ? "is-active" : ""}">${item}</span>`,
      )
      .join("");
    nodes.forEach((node, index) => {
      const item = chapter.nodes[index];
      if (!item) {
        node.className = node.className.replace(
          /\s*has-visual|\s*has-people/g,
          "",
        );
        node.classList.add("is-unused");
        node.innerHTML = "";
        return;
      }
      node.classList.remove("is-unused");
      const asset = item[4];
      node.classList.toggle("has-visual", Boolean(asset));
      node.classList.toggle("has-people", item[5] === "people");
      node.innerHTML = `${asset ? `<img class="fj-node-visual" src="${asset}" alt="">` : ""}<div class="fj-node-body"><div class="fj-node-label"><span class="fj-node-icon">${item[0]}</span><div class="fj-node-copy"><small>${item[1]}</small><strong>${item[2]}</strong></div></div><p>${item[3]}</p></div>`;
    });
    routes.forEach((route, index) =>
      route.setAttribute("d", chapter.paths[index] || ""),
    );
  };

  const update = () => {
    ticking = false;
    const rect = journey.getBoundingClientRect();
    if (innerWidth <= 820) {
      root.classList.toggle(
        "is-pinned",
        rect.top <= 0 && rect.bottom >= innerHeight,
      );
      root.classList.toggle("is-after", rect.bottom < innerHeight);
    } else {
      root.classList.remove("is-pinned", "is-after");
    }
    const distance = journey.offsetHeight - innerHeight;
    const progress = clamp(-rect.top / Math.max(distance, 1));
    const scaled = Math.min(
      progress * chapters.length,
      chapters.length - 0.0001,
    );
    const chapterIndex = Math.floor(scaled);
    const local = scaled - chapterIndex;
    const chapter = chapters[chapterIndex];
    const stepScaled = Math.min(
      local * chapter.steps.length,
      chapter.steps.length - 0.0001,
    );
    const stepIndex = Math.floor(stepScaled);
    const stepProgress = stepScaled - stepIndex;
    const step = chapter.steps[stepIndex];
    const key = `${chapterIndex}-${stepIndex}`;
    const activeNodeIndex = isMobileJourney
      ? mobileStepNodes[chapterIndex][stepIndex]
      : chapter.stepRoutes?.[stepIndex] ?? stepIndex;

    root.style.setProperty("--fj-progress", progress.toFixed(4));
    root.style.setProperty(
      "--fj-tilt-x",
      `${(1.1 + Math.cos(progress * Math.PI * 8) * 0.65).toFixed(3)}deg`,
    );
    root.style.setProperty(
      "--fj-tilt-y",
      `${(Math.sin(progress * Math.PI * 8) * 2.1).toFixed(3)}deg`,
    );
    $("[data-fj-count]").textContent =
      `${String(chapterIndex + 1).padStart(2, "0")} / 04`;
    chapterLabels.forEach((label, index) =>
      label.classList.toggle("is-active", index === chapterIndex),
    );

    if (!currentKey.startsWith(`${chapterIndex}-`)) renderChapter(chapter);
    if (key !== currentKey) {
      currentKey = key;
      screen.innerHTML = `<div class="fj-screen-inner">${views[step[2]]()}</div>`;
      $("[data-fj-step]").textContent = isMobileJourney
        ? "CHANGE"
        : `STEP ${String(stepIndex + 1).padStart(2, "0")}`;
      $("[data-fj-action-title]").textContent = isMobileJourney
        ? `${step[3]} - ${step[4]}`
        : step[0];
      $("[data-fj-action-copy]").textContent = isMobileJourney
        ? step[0]
        : step[1];
      if (isMobileJourney && mobileRoute) {
        mobileRoute.innerHTML = mobileStepLabels[chapterIndex]
          .map(
            (label, index) =>
              `<span class="${index < stepIndex ? "is-complete" : index === stepIndex ? "is-active" : ""}"><b>${String(index + 1).padStart(2, "0")}</b><small>${label}</small></span>`,
          )
          .join("");
      }
      renderMobileProcess(chapterIndex, stepIndex);
      token.innerHTML = `<strong>${step[3]}</strong><small>${step[4]}</small>`;
    }

    nodes.forEach((node, index) => {
      node.classList.toggle("is-current", index === activeNodeIndex);
      if (!chapter.nodes[index]) {
        node.style.setProperty("--node-opacity", 0);
        return;
      }
      const order = chapter.nodeOrder?.[index] ?? index;
      const reveal = smooth(order * 0.16 + 0.01, order * 0.16 + 0.13, local);
      const visibleReveal =
        isMobileJourney && index === activeNodeIndex
          ? Math.max(reveal, 0.96)
          : reveal;
      node.style.setProperty("--node-opacity", visibleReveal.toFixed(3));
      node.style.setProperty("--node-y", `${(1 - visibleReveal) * 18}px`);
      node.style.setProperty(
        "--node-scale",
        (0.94 + visibleReveal * 0.06).toFixed(3),
      );
      node.style.setProperty(
        "--node-z",
        `${(12 + ((index % 3) + 1) * 7 * reveal).toFixed(2)}px`,
      );
    });
    routes.forEach((route, index) => {
      if (!chapter.nodes[index]) {
        route.style.setProperty("--route-opacity", 0);
        return;
      }
      const order = chapter.nodeOrder?.[index] ?? index;
      const reveal = smooth(order * 0.16 + 0.07, order * 0.16 + 0.21, local);
      route.style.setProperty(
        "--route-opacity",
        (0.15 + reveal * 0.85).toFixed(3),
      );
      route.style.setProperty("--route-offset", `${180 * (1 - reveal)}`);
    });

    const path = routes[chapter.stepRoutes?.[stepIndex] ?? stepIndex];
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(
      pathLength * smooth(0.08, 0.9, stepProgress),
    );
    const bounds = canvas.getBoundingClientRect();
    token.style.left = `${(point.x / 1440) * bounds.width}px`;
    token.style.top = `${(point.y / 680) * bounds.height}px`;
    token.style.setProperty(
      "--token-opacity",
      smooth(0.04, 0.18, stepProgress) * (1 - smooth(0.82, 0.98, stepProgress)),
    );

    const cursor = $("[data-fj-cursor]");
    const cursorVisible =
      smooth(0.22, 0.35, stepProgress) * (1 - smooth(0.78, 0.9, stepProgress));
    cursor.style.setProperty("--fj-cursor-opacity", cursorVisible.toFixed(3));
    cursor.style.setProperty("--fj-cursor-x", `${380 + stepIndex * 24}px`);
    cursor.style.setProperty(
      "--fj-cursor-y",
      `${190 + (stepIndex % 2) * 70}px`,
    );
    cursor.style.setProperty(
      "--fj-click",
      smooth(0.55, 0.62, stepProgress) * (1 - smooth(0.68, 0.76, stepProgress)),
    );
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  update();
}

const payrollStory = document.querySelector("[data-payroll-story]");

if (payrollStory) {
  const demo = payrollStory.querySelector("[data-payroll-demo]");
  const formulaText = payrollStory.querySelector("[data-formula-text]");
  const componentName = payrollStory.querySelector("[data-component-name]");
  const componentCode = payrollStory.querySelector("[data-component-code]");
  const componentCopy = payrollStory.querySelector("[data-component-copy]");
  const step = payrollStory.querySelector("[data-payroll-step]");
  const title = payrollStory.querySelector("[data-payroll-title]");
  const status = payrollStory.querySelector("[data-payroll-status]");
  const state = payrollStory.querySelector("[data-payroll-state]");
  const intelFunction = payrollStory.querySelector("[data-intel-function]");
  const intelCopy = payrollStory.querySelector("[data-intel-copy]");
  const validationTitle = payrollStory.querySelector("[data-validation-title]");
  const validationCopy = payrollStory.querySelector("[data-validation-copy]");
  const saveButton = payrollStory.querySelector("[data-save-button]");
  const ruleNote = payrollStory.querySelector("[data-rule-note]");
  const toastTitle = payrollStory.querySelector("[data-toast-title]");
  const captionStep = payrollStory.querySelector("[data-payroll-caption-step]");
  const captionTitle = payrollStory.querySelector(
    "[data-payroll-caption-title]",
  );
  const captionCopy = payrollStory.querySelector("[data-payroll-caption-copy]");

  const formulas = {
    hra: "IF(BASIC > 0, MIN(BASIC * 0.40, 20000), 0)",
    epf: "MIN((BASIC + DA) * 0.12, 1800)",
  };

  const scenes = [
    {
      end: 0.07,
      number: "01",
      step: "01 / 06",
      title: "Define HRA",
      status: "Component setup",
      caption: "Start with a named component",
      copy: "HRA is defined as a governed earning inside the salary template.",
    },
    {
      end: 0.32,
      number: "02",
      step: "02 / 06",
      title: "Build the HRA formula",
      status: "Formula intelligence",
      caption: "Compose logic with payroll intelligence",
      copy: "Functions and available components appear while the rule is being written.",
    },
    {
      end: 0.5,
      number: "03",
      step: "03 / 06",
      title: "Validate and save HRA",
      status: "Governed change",
      caption: "Validate before the rule becomes active",
      copy: "Syntax and component references are checked, then the approved formula is saved.",
    },
    {
      end: 0.62,
      number: "04",
      step: "04 / 06",
      title: "Define EPF",
      status: "Statutory deduction",
      caption: "Apply the same control to EPF",
      copy: "The statutory deduction begins as a separate, inspectable payroll component.",
    },
    {
      end: 0.88,
      number: "05",
      step: "05 / 06",
      title: "Build and validate EPF",
      status: "Formula intelligence",
      caption: "Make complex deductions readable",
      copy: "The contribution base, rate and ceiling remain visible to authorized payroll teams.",
    },
    {
      end: 1,
      number: "06",
      step: "06 / 06",
      title: "Review the salary template",
      status: "Calculation order",
      caption: "See every component in one governed template",
      copy: "Earnings, deductions, formulas and validation states stay together and inspectable.",
    },
  ];

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const typeFormula = (formula, amount) =>
    formula.slice(0, Math.round(formula.length * clamp(amount)));

  const setSceneCopy = (progress) => {
    const scene = scenes.find((item) => progress < item.end) || scenes.at(-1);
    step.textContent = scene.step;
    title.textContent = scene.title;
    status.textContent = scene.status;
    captionStep.textContent = scene.number;
    captionTitle.textContent = scene.caption;
    captionCopy.textContent = scene.copy;
  };

  const setIntelligence = (formula, isEpf) => {
    const usesMinimum = formula.includes("MIN");
    const usesCondition = formula.startsWith("IF");
    if (usesMinimum) {
      intelFunction.textContent = "MIN";
      intelCopy.textContent = isEpf
        ? "Apply the configured contribution ceiling"
        : "Return the lower calculated allowance";
    } else if (usesCondition) {
      intelFunction.textContent = "IF";
      intelCopy.textContent = "Apply a condition before calculation";
    } else {
      intelFunction.textContent = isEpf ? "BASIC + DA" : "BASIC";
      intelCopy.textContent = "Available salary component reference";
    }
  };

  const renderPayroll = (progress) => {
    const isEpf = progress >= 0.5;
    const showTable = progress >= 0.9;
    let formula = "";
    let intelligence = false;
    let valid = false;
    let saved = false;

    setSceneCopy(progress);

    if (!isEpf) {
      componentName.textContent = "HRA";
      componentCode.textContent = "HRA";
      componentCopy.textContent = "House Rent Allowance / Earning";
      formula = typeFormula(formulas.hra, range(progress, 0, 0.3));
      intelligence = progress >= 0.008 && progress < 0.285;
      valid = progress >= 0.32;
      saved = progress >= 0.41;
      validationTitle.textContent = "HRA formula validated";
      validationCopy.textContent =
        "References, condition and allowance ceiling are valid.";
      toastTitle.textContent = "HRA saved";
    } else {
      componentName.textContent = "EPF";
      componentCode.textContent = "EPF_EE";
      componentCopy.textContent = "Employee Provident Fund / Deduction";
      formula = typeFormula(formulas.epf, range(progress, 0.58, 0.79));
      intelligence = progress >= 0.59 && progress < 0.77;
      valid = progress >= 0.8;
      saved = progress >= 0.86;
      validationTitle.textContent = "EPF formula validated";
      validationCopy.textContent =
        "Contribution base, rate and configured ceiling are valid.";
      toastTitle.textContent = "EPF saved";
    }

    formulaText.textContent = formula;
    setIntelligence(formula, isEpf);
    demo.classList.toggle("is-intelligence", intelligence && !showTable);
    demo.classList.toggle("is-valid", valid && !showTable);
    demo.classList.toggle("is-saved", saved && !showTable);
    demo.classList.toggle("show-components", showTable);
    state.textContent = saved
      ? "Validated & saved"
      : valid
        ? "Validated"
        : "Draft rule";
    state.classList.toggle("is-valid", valid);
    saveButton.textContent = saved ? "Saved" : "Save component";
    ruleNote.textContent = saved
      ? "The validated rule is now part of this salary template."
      : "Changes remain in draft until saved.";
  };

  const activeDuration = 34000;
  const finalHold = 5500;
  const cycleDuration = activeDuration + finalHold;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animationFrame = 0;
  let cycleStart = null;
  let isVisible = false;

  const animatePayroll = (now) => {
    if (!isVisible || reduceMotion) return;
    if (cycleStart === null) cycleStart = now;
    let elapsed = now - cycleStart;
    if (elapsed >= cycleDuration) {
      cycleStart = now;
      elapsed = 0;
    }
    renderPayroll(clamp(elapsed / activeDuration));
    animationFrame = requestAnimationFrame(animatePayroll);
  };

  const playbackObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible = true;
        cycleStart = null;
        cancelAnimationFrame(animationFrame);
        if (reduceMotion) {
          renderPayroll(1);
        } else {
          renderPayroll(0);
          animationFrame = requestAnimationFrame(animatePayroll);
        }
      } else {
        isVisible = false;
        cancelAnimationFrame(animationFrame);
      }
    },
    { threshold: 0.05 },
  );

  renderPayroll(reduceMotion ? 1 : 0);
  playbackObserver.observe(demo);
}
