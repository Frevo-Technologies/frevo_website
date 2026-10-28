(() => {
  document.body.classList.add("motion-ready");
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  const signature = $(".frevo-signature");
  const signatureRoot = document.documentElement;
  if (signature && signatureRoot.classList.contains("signature-pending")) {
    const signatureLogo = $(".frevo-signature-logo", signature);
    const signatureCopy = $(".frevo-signature-copy", signature);
    const headerBrand = $(".site-header .brand");
    const headerLogo = headerBrand && $("img", headerBrand);
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let completed = false;

    const finishSignature = () => {
      if (completed) return;
      completed = true;
      window.clearTimeout(window.__frevoSignatureFallback);
      signature.hidden = true;
      signatureRoot.classList.remove("signature-pending");
    };

    if (!window.__frevoSignaturePreview) {
      try {
        sessionStorage.setItem(
          window.__frevoSignatureSessionKey || "frevo-signature-seen-v3",
          "true",
        );
      } catch {
        // The fallback still guarantees access when storage is unavailable.
      }
    }

    window.requestAnimationFrame(() => {
      try {
        signature.classList.add("is-active");

        if (reduceMotion || !signatureLogo || !headerBrand || !headerLogo) {
          const fade = signature.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 180,
            easing: "ease-out",
            fill: "forwards",
          });
          fade.finished.then(finishSignature, finishSignature);
          return;
        }

        const from = signatureLogo.getBoundingClientRect();
        const to = headerLogo.getBoundingClientRect();
        const translateX =
          to.left + to.width / 2 - (from.left + from.width / 2);
        const translateY =
          to.top + to.height / 2 - (from.top + from.height / 2);
        const scale = to.width / from.width;

        const logoMotion = signatureLogo.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1)" },
            {
              transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
            },
          ],
          {
            duration: 760,
            delay: 1100,
            easing: "cubic-bezier(.76, 0, .24, 1)",
            fill: "forwards",
          },
        );
        const copyFade = signatureCopy.animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-5px)" },
          ],
          {
            duration: 320,
            delay: 1200,
            easing: "ease-out",
            fill: "forwards",
          },
        );
        const pageReveal = signature.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 460,
          delay: 1740,
          easing: "ease-out",
          fill: "forwards",
        });
        const headerReveal = headerBrand.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: 240,
            delay: 1900,
            easing: "ease-out",
            fill: "forwards",
          },
        );

        Promise.allSettled([
          logoMotion.finished,
          copyFade.finished,
          pageReveal.finished,
          headerReveal.finished,
        ]).then(finishSignature);
      } catch {
        finishSignature();
      }
    });
  }

  $$("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const menuButton = $(".menu-toggle");
  const nav = $("#main-nav");
  const dropdownMenus = $$(".nav-products");
  const closeDropdowns = (except = null, returnFocus = false) => {
    dropdownMenus.forEach((menu) => {
      if (menu === except) return;
      const trigger = $(".nav-products-trigger", menu);
      const wasOpen = menu.classList.contains("is-open");
      menu.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
      if (returnFocus && wasOpen) trigger?.focus();
    });
  };

  dropdownMenus.forEach((dropdownMenu) => {
    const dropdownTrigger = $(".nav-products-trigger", dropdownMenu);
    const dropdownSubmenu = $(".products-submenu", dropdownMenu);
    if (!dropdownTrigger || !dropdownSubmenu) return;
    const dropdownLinks = $$("a", dropdownSubmenu);
    const closeDropdown = (returnFocus = false) => {
      dropdownMenu.classList.remove("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
      if (returnFocus) dropdownTrigger.focus();
    };
    const openDropdown = () => {
      closeDropdowns(dropdownMenu);
      dropdownMenu.classList.add("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "true");
    };

    dropdownTrigger.addEventListener("click", () => {
      if (dropdownMenu.classList.contains("is-open")) closeDropdown();
      else openDropdown();
    });
    dropdownTrigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      openDropdown();
      dropdownLinks[0]?.focus();
    });
    dropdownSubmenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown(true);
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = Math.max(0, dropdownLinks.indexOf(document.activeElement));
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? dropdownLinks.length - 1
            : event.key === "ArrowDown"
              ? (current + 1) % dropdownLinks.length
              : (current - 1 + dropdownLinks.length) % dropdownLinks.length;
      dropdownLinks[next]?.focus();
    });
  });

  if (dropdownMenus.length) {
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-products")) closeDropdowns();
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute(
        "aria-label",
        open ? "Open navigation" : "Close navigation",
      );
      nav.classList.toggle("open", !open);
      if (open) closeDropdowns();
    });
    $$("a", nav).forEach((link) =>
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        closeDropdowns();
      }),
    );
  }

  const revealItems = $$(".reveal");
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  const flowProducts = {
    frevone: {
      name: "FrevOne",
      theme: "frevone",
      label: "FREVONE / WORKFORCE",
      title: "How FrevOne works",
      cta: ["Explore FrevOne", "/products/frevone/"],
      description:
        "Follow one person as information moves through independent workforce modules.",
      chapters: [
        {
          name: "A · Recruit & join",
          note: "Meera Sharma remains the same sample person from candidate to employee.",
          modules: [
            [
              "talent",
              "Talent Acquisition",
              "Requisitions, candidates, interviews and offers.",
              "Approved requisition and candidate profile",
              "Selection status and offer activity",
            ],
            [
              "workflow",
              "Workflow",
              "Routes offer and hiring actions to accountable reviewers.",
              "Offer action and approval rules",
              "Approved or rejected decision",
            ],
            [
              "employees",
              "Employee Records",
              "Creates the governed employee master and assignments.",
              "Accepted offer and joining details",
              "Employee ID, department, role and manager",
            ],
            [
              "notifications",
              "Notifications",
              "Queues configured onboarding communication.",
              "Employee identity and contact details",
              "Welcome communication and delivery log",
            ],
            [
              "ess",
              "ESS / MSS",
              "Provides permission-based employee and manager access.",
              "Employee ID, role and enabled permissions",
              "Self-service access and future requests",
            ],
          ],
          steps: [
            [
              "talent",
              "workflow",
              "Selected candidate + offer",
              "Offer approval task created for an authorized reviewer.",
              true,
            ],
            [
              "workflow",
              "talent",
              "Approved offer",
              "Meera Sharma’s candidate status changes to Offer approved.",
              true,
            ],
            [
              "talent",
              "employees",
              "Accepted offer + joining details",
              "HR reviews the information before creating employee record EMP-2048.",
              true,
            ],
            [
              "employees",
              "notifications",
              "Employee ID + contact details",
              "Configured welcome communication is queued.",
            ],
            [
              "employees",
              "ess",
              "Employee ID + permissions",
              "Meera’s self-service access becomes available.",
            ],
          ],
        },
        {
          name: "B · Work & manage",
          note: "Recurring leave, attendance, approval and payroll relationships.",
          modules: [
            [
              "employees",
              "Employee Records",
              "Supplies identity, organization and salary assignment context.",
              "Approved employee changes",
              "Current employee and salary assignments",
            ],
            [
              "policy",
              "Policy & Settings",
              "Resolves client-specific leave, shift and payroll rules.",
              "Client, location and employee assignments",
              "Applicable policies and calculation rules",
            ],
            [
              "ess",
              "ESS / MSS",
              "Access point for requests, tasks, team views and payslips.",
              "Permissions and published information",
              "Employee request or manager action",
            ],
            [
              "workflow",
              "Workflow",
              "Routes configured requests to an accountable approver.",
              "Request, hierarchy and routing rules",
              "Approval decision and history",
            ],
            [
              "attendance",
              "Leave & Attendance",
              "Maintains approved leave and reviewed payable-day inputs.",
              "Attendance events, policies and approved leave",
              "Reviewed attendance and payable days",
            ],
            [
              "payroll",
              "Payroll",
              "Combines reviewed inputs with salary and statutory rules.",
              "Payable days, salary template and adjustments",
              "Validated payrun and payslip",
            ],
            [
              "reports",
              "Reports",
              "Receives operational and payrun status for authorized reporting.",
              "Approved records and payrun results",
              "Filtered reports and exports",
            ],
          ],
          steps: [
            [
              "employees",
              "policy",
              "Client + employee assignment",
              "Applicable shift, leave and payroll policies are resolved.",
            ],
            [
              "ess",
              "workflow",
              "Leave request · 14–15 Oct",
              "Manager approval task is created for Meera’s request.",
              true,
            ],
            [
              "workflow",
              "attendance",
              "Approved leave",
              "Leave record and attendance context are updated.",
              true,
            ],
            [
              "attendance",
              "payroll",
              "Reviewed payable days",
              "Payroll readiness now includes approved leave.",
            ],
            [
              "employees",
              "payroll",
              "Salary template + statutory IDs",
              "Meera’s configured salary context is available to the payrun.",
            ],
            [
              "payroll",
              "ess",
              "Published payslip",
              "October payslip becomes available in self-service.",
            ],
            [
              "payroll",
              "reports",
              "Payrun status",
              "Authorized payroll reporting reflects the completed run.",
            ],
          ],
        },
        {
          name: "C · Exit & record closure",
          note: "Limited verified flow: no dedicated clearance or full-and-final module is claimed.",
          modules: [
            [
              "ess",
              "ESS / MSS",
              "Can initiate configured requests and display assigned tasks.",
              "Enabled process and employee identity",
              "Submitted status-change request",
            ],
            [
              "workflow",
              "Workflow",
              "Routes a configured status-change action for human review.",
              "Request, effective date and approver rules",
              "Recorded approval decision",
            ],
            [
              "employees",
              "Employee Records",
              "Maintains active or inactive status and effective employee data.",
              "Approved status and effective date",
              "Updated employee status",
            ],
            [
              "payroll",
              "Payroll Review",
              "Allows authorized payroll teams to review final configured inputs.",
              "Effective date, attendance and adjustments",
              "Reviewed payrun result",
            ],
            [
              "reports",
              "Reports",
              "Reflects approved employee and payroll records.",
              "Updated employee and payrun status",
              "Authorized operational record",
            ],
          ],
          steps: [
            [
              "ess",
              "workflow",
              "Status-change request",
              "A human review task is created; no status changes automatically.",
              true,
            ],
            [
              "workflow",
              "employees",
              "Approved effective status",
              "The employee record is updated with the reviewed effective date.",
              true,
            ],
            [
              "employees",
              "payroll",
              "Effective date + salary context",
              "Payroll receives inputs for authorized review, not automatic settlement.",
            ],
            [
              "payroll",
              "reports",
              "Reviewed payrun result",
              "The authorized operational record reflects the reviewed outcome.",
            ],
          ],
        },
      ],
    },
    frevdesk: {
      name: "FrevDesk",
      theme: "frevdesk",
      label: "FREVDESK / ITSM + ITAM",
      title: "Follow work through FrevDesk",
      cta: ["Explore FrevDesk", "/products/frevdesk/"],
      description:
        "Track one service request or one asset through its own accountable lifecycle.",
      chapters: [
        {
          name: "Service desk",
          note: "INC-284 remains visible across four accountable service groups.",
          modules: [
            [
              "intake",
              "Intake & Triage",
              "Turns incoming requests into structured, prioritized work.",
              "Requester context and issue details",
              "Classified service record",
              ["Portal intake", "Ticket creation", "Category & priority"],
              "Suggested classification and rule-based routing",
            ],
            [
              "ownership",
              "Ownership & SLA",
              "Establishes accountability and the applicable service commitment.",
              "Classified record and support rules",
              "Owner, queue and active SLA",
              ["Queue assignment", "Owner selection", "SLA & escalation"],
              "Queue assignment, SLA timers and escalation alerts",
            ],
            [
              "delivery",
              "Fulfilment & Resolution",
              "Keeps investigation, communication and closure in one traceable record.",
              "Assigned ticket and SLA context",
              "Resolved ticket with activity history",
              ["Work notes", "Requester updates", "Resolve & confirm"],
              "Status transitions, notifications and closure reminders",
            ],
            [
              "insights",
              "Service Intelligence",
              "Converts service history into operational and improvement insight.",
              "Ticket history, workload and SLA result",
              "Dashboards, trends and service reports",
              ["SLA analysis", "Workload trends", "Service reporting"],
              "Scheduled reports and breach or trend alerts",
            ],
          ],
          steps: [
            [
              "intake",
              "ownership",
              "Classified INC-284",
              "Classification rules suggest Access & Identity, apply Medium priority and route the ticket to Access Operations.",
            ],
            [
              "ownership",
              "delivery",
              "Owner + 8-hour SLA",
              "The SLA timer starts and escalation alerts remain ready while the team works.",
            ],
            [
              "delivery",
              "insights",
              "Resolution + complete history",
              "Closure updates dashboards automatically and preserves the full service trail.",
            ],
          ],
        },
        {
          name: "Asset lifecycle",
          note: "LT-048 remains the same sample laptop through every record change.",
          modules: [
            [
              "acquire",
              "Acquire & Register",
              "Creates a governed asset identity from receipt and stock information.",
              "Purchase, receipt and identifying details",
              "Asset ID LT-048 and stock record",
              ["Receive & verify", "Create asset ID", "Place in stock"],
              "Asset ID generation and duplicate or warranty checks",
            ],
            [
              "custody",
              "Assign & Move",
              "Maintains accountable custody through assignment, transfer and return.",
              "Asset record and approved custody action",
              "Current custodian and location",
              ["Assign custodian", "Transfer location", "Return to stock"],
              "Handover notifications and custody history updates",
            ],
            [
              "govern",
              "Audit & Govern",
              "Compares expected custody, location and condition with observed evidence.",
              "Expected asset record and audit evidence",
              "Verified result or governed exception",
              ["Plan audit", "Verify asset", "Record exception"],
              "Audit reminders, exception flags and reconciliation queues",
            ],
            [
              "retire",
              "Retire & Report",
              "Closes the lifecycle through approval while keeping evidence reportable.",
              "Approved lifecycle decision and asset history",
              "Retired status, evidence and reporting",
              ["Approve disposal", "Record evidence", "Update reports"],
              "Approval routing and automatic inventory status updates",
            ],
          ],
          steps: [
            [
              "acquire",
              "custody",
              "Registered asset LT-048",
              "The approved custodian, location and complete handover history are recorded together.",
            ],
            [
              "custody",
              "govern",
              "Current custody + location",
              "A scheduled audit compares expected ownership with observed evidence and flags exceptions.",
            ],
            [
              "govern",
              "retire",
              "Verified lifecycle decision",
              "Approval routing controls retirement, then inventory and reports update automatically.",
              true,
            ],
          ],
        },
      ],
    },
    frevguard: {
      name: "FrevGuard",
      theme: "frevguard",
      label: "FREVGUARD / CONTROL OF WORK",
      title: "Follow a work permit",
      cta: ["Explore FrevGuard", "/products/frevguard/"],
      description:
        "Follow PTW-192 as field evidence moves to authorized approval and safe hand-back.",
      chapters: [
        {
          name: "Permit lifecycle",
          note: "PTW-192 is an illustrative hot-work permit; approval remains human-controlled.",
          modules: [
            [
              "request",
              "Permit Request",
              "Defines the work, site, timing and people involved.",
              "Job scope and location",
              "Draft permit PTW-192",
            ],
            [
              "risk",
              "Risk & Checklist",
              "Records hazards, controls and required checks.",
              "Permit scope and site rules",
              "Risk controls and checklist result",
            ],
            [
              "isolation",
              "Isolation",
              "Records required energy-control evidence.",
              "Equipment and isolation points",
              "Isolation verification",
            ],
            [
              "gas",
              "Gas Testing",
              "Records atmospheric results and test time.",
              "Required test and field readings",
              "Gas-test evidence",
            ],
            [
              "approval",
              "Authorized Approval",
              "Presents required evidence to an accountable authority.",
              "Risk, isolation and gas-test evidence",
              "Approval or rejection with context",
            ],
            [
              "tracking",
              "Permit Tracking",
              "Maintains issued status, validity and field progress.",
              "Authorized approval and permit conditions",
              "Issued, suspended or active state",
            ],
            [
              "closure",
              "Closure & Audit",
              "Records hand-back, close-out and traceable history.",
              "Completion checks and hand-back",
              "Closed permit and audit record",
            ],
          ],
          steps: [
            [
              "request",
              "risk",
              "Job scope + location",
              "Required hazards and control checks are loaded.",
            ],
            [
              "risk",
              "isolation",
              "Required control measures",
              "Isolation points are recorded against PTW-192.",
            ],
            [
              "isolation",
              "gas",
              "Verified isolation",
              "Atmospheric testing becomes the next required check.",
            ],
            [
              "gas",
              "approval",
              "Gas result · 08:42",
              "The authorized person receives complete field evidence.",
              true,
            ],
            [
              "approval",
              "tracking",
              "Authorized approval",
              "PTW-192 changes to Issued with its validity and conditions.",
              true,
            ],
            [
              "tracking",
              "closure",
              "Completion + safe hand-back",
              "The permit closes with a traceable audit record.",
              true,
            ],
          ],
        },
      ],
    },
  };

  const createFlowController = (root, fixedProduct = null) => {
    let productKey =
      fixedProduct ||
      localStorage.getItem("frevo-preview-product") ||
      "frevone";
    if (!flowProducts[productKey]) productKey = "frevone";
    let chapterIndex = 0;
    let stepIndex = 0;
    let timer = null;
    let playing = false;
    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const productKeys = Object.keys(flowProducts);
    const productTabs = $$("[data-flow-product]", root);
    const productSelect = $("[data-flow-select]", root);
    const productIndex = $("[data-flow-product-index]", root);
    const chapterTabs = $(".showcase-chapters", root);
    const map = $(".module-map", root);
    const source = $(".packet-source", root);
    const destination = $(".packet-destination", root);
    const packet = $(".packet-label", root);
    const result = $(".flow-result p", root);
    const progress = $(".flow-progress", root);
    const detail = $(".module-detail", root);
    const inspector = $(".module-inspector", root);

    const data = () => flowProducts[productKey];
    const chapter = () => data().chapters[chapterIndex];
    if (productSelect)
      productSelect.innerHTML = productKeys
        .map(
          (key) => `<option value="${key}">${flowProducts[key].name}</option>`,
        )
        .join("");
    const stop = () => {
      clearInterval(timer);
      timer = null;
      playing = false;
      root.classList.remove("is-playing");
    };
    const inspect = (module) => {
      if (detail) {
        $("h3", detail).textContent = module[1];
        $("p", detail).textContent = module[2];
        const values = $$("dd", detail);
        values[0].textContent = module[3];
        values[1].textContent = module[4];
        detail.classList.add("open");
      }
      if (inspector) {
        $("[data-inspect-name]", inspector).textContent = module[1];
        $("[data-inspect-input]", inspector).textContent = module[3];
        $("[data-inspect-output]", inspector).textContent = module[4];
      }
    };
    const renderStep = () => {
      const current = chapter().steps[stepIndex];
      $$(".module-card", map).forEach((card) => {
        card.classList.toggle("is-source", card.dataset.module === current[0]);
        card.classList.toggle(
          "is-destination",
          card.dataset.module === current[1],
        );
        card.classList.toggle("is-changed", card.dataset.module === current[1]);
      });
      const sourceModule = chapter().modules.find(
        (module) => module[0] === current[0],
      );
      const destinationModule = chapter().modules.find(
        (module) => module[0] === current[1],
      );
      source.textContent = sourceModule[1];
      destination.textContent = destinationModule[1];
      packet.textContent = current[2];
      result.textContent = `${current[3]}${current[4] ? " Human review required." : ""}`;
      progress.textContent = `Flow ${String(chapterIndex + 1).padStart(2, "0")} · Step ${stepIndex + 1} of ${chapter().steps.length}`;
      const activeLink = $("[data-active-link]", map);
      if (activeLink && map._positions) {
        const from =
          map._positions[
            chapter().modules.findIndex((module) => module[0] === current[0])
          ];
        const to =
          map._positions[
            chapter().modules.findIndex((module) => module[0] === current[1])
          ];
        if (map._layout === "process-lanes") {
          const routePath = `M ${from.x * 10} 92 V 298 H ${(from.x + to.x) * 5} V 52 H ${to.x * 10} V 92`;
          activeLink.setAttribute("d", routePath);
          const routeMotion = $("[data-route-motion]", map);
          if (routeMotion) {
            routeMotion.setAttribute("path", routePath);
            if (routeMotion.beginElement) routeMotion.beginElement();
          }
        } else {
          activeLink.setAttribute("x1", from.x * 10);
          activeLink.setAttribute("y1", from.y * 3.6);
          activeLink.setAttribute("x2", to.x * 10);
          activeLink.setAttribute("y2", to.y * 3.6);
        }
        const flowCaption = $("[data-flow-caption]", map);
        if (flowCaption) {
          const deltaX = to.x - from.x;
          const deltaY = to.y - from.y;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          let captionX = (from.x + to.x) / 2;
          let captionY = (from.y + to.y) / 2;
          if (Math.hypot(captionX - 50, captionY - 50) < 20) {
            captionX += (-deltaY / distance) * 12;
            captionY += (deltaX / distance) * 9;
          }
          $("[data-flow-packet]", flowCaption).textContent = current[2];
          $("[data-flow-change]", flowCaption).textContent =
            `${current[3]}${current[4] ? " Human review required." : ""}`;
          flowCaption.style.left = `${captionX}%`;
          flowCaption.style.top = `${captionY}%`;
          flowCaption.classList.remove("is-updating");
          void flowCaption.offsetWidth;
          flowCaption.classList.add("is-updating");
        }
      }
      root.classList.remove("is-playing");
      void root.offsetWidth;
      if (playing && !reducedMotion) root.classList.add("is-playing");
    };
    const renderMap = () => {
      const captions = {
        frevone: "LOOP",
        frevdesk: "GROUP",
        frevguard: "GATE",
      };
      const theme = data().theme || "frevdesk";
      if (theme === "frevone") {
        map._layout = "orbit";
        const count = chapter().modules.length;
        map._positions = chapter().modules.map((module, index) => {
          const angle = ((-90 + (360 / count) * index) * Math.PI) / 180;
          return { x: 50 + 39 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) };
        });
        const relationshipLines = chapter()
          .steps.map((step) => {
            const from =
              map._positions[
                chapter().modules.findIndex((module) => module[0] === step[0])
              ];
            const to =
              map._positions[
                chapter().modules.findIndex((module) => module[0] === step[1])
              ];
            return `<line x1="${from.x * 10}" y1="${from.y * 3.6}" x2="${to.x * 10}" y2="${to.y * 3.6}"/>`;
          })
          .join("");
        const recordId =
          chapterIndex === 0 ? "MEERA / CANDIDATE" : "EMP-2048 / MEERA";
        map.innerHTML = `<svg class="module-links" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true"><g>${relationshipLines}</g><line class="active-module-link" data-active-link/></svg><div class="orbit-core"><small>CURRENT RECORD</small><strong>${recordId}</strong><span>${chapter().name.replace(/^[A-C] Â· /, "")}</span></div><div class="orbit-line-caption" data-flow-caption aria-live="polite"><small>RECORD MOVING</small><strong data-flow-packet></strong><span data-flow-change></span></div>${chapter()
          .modules.map(
            (module, index) =>
              `<button type="button" class="module-card" style="--x:${map._positions[index].x}%;--y:${map._positions[index].y}%" data-module="${module[0]}" aria-label="Inspect ${module[1]}"><small>${captions[theme]} ${String(index + 1).padStart(2, "0")}</small><strong>${module[1]}</strong><span>${module[2]}</span></button>`,
          )
          .join("")}`;
      } else if (theme === "frevdesk") {
        const count = chapter().modules.length;
        map._layout = "process-lanes";
        map._positions = chapter().modules.map((module, index) => ({
          x: ((index + 0.5) / count) * 100,
          y: 82,
        }));
        const processLines = map._positions
          .map((position) => `<path d="M ${position.x * 10} 92 V 298"/>`)
          .join("");
        const handoffLines = map._positions
          .slice(0, -1)
          .map(
            (position, index) =>
              `<path d="M ${position.x * 10} 298 V 362 H ${map._positions[index + 1].x * 10} V 92"/>`,
          )
          .join("");
        const laneCards = chapter()
          .modules.map((module, index) => {
            const processBoxes = module[5]
              .map(
                (item, processIndex) =>
                  `<span class="process-box"><i>${String(processIndex + 1).padStart(2, "0")}&nbsp;</i><b>${item}</b></span>`,
              )
              .join("");
            return `<button type="button" class="module-card swimlane process-lane" data-module="${module[0]}" aria-label="Inspect ${module[1]}"><span class="group-heading"><small>${captions[theme]} ${String(index + 1).padStart(2, "0")}</small><strong>${module[1]}</strong><span>${module[2]}</span></span><span class="lane-subprocesses"><em>SUB-PROCESSES</em>${processBoxes}</span><span class="lane-automation"><em>SYSTEM ACTION</em><b>${module[6]}</b></span></button>`;
          })
          .join("");
        map.innerHTML = `<svg class="module-links swimlane-links process-links" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true"><g>${processLines}${handoffLines}</g><path class="active-module-link" data-active-link/><circle class="route-dot" r="6"><animateMotion data-route-motion dur="5.5s" repeatCount="indefinite" path=""/></circle></svg><div class="swimlane-grid process-lane-grid" style="--lane-count:${count}">${laneCards}</div><div class="route-line-caption" data-flow-caption aria-live="polite"><small>WORK ITEM MOVING</small><strong data-flow-packet></strong><span data-flow-change></span></div>`;
      } else if (theme === "frevguard") {
        const count = chapter().modules.length;
        map._layout = "swimlane";
        map._positions = chapter().modules.map((module, index) => ({
          x: ((index + 0.5) / count) * 100,
          y: 82,
        }));
        const routeLines = map._positions
          .slice(0, -1)
          .map(
            (position, index) =>
              `<line x1="${position.x * 10}" y1="295" x2="${map._positions[index + 1].x * 10}" y2="295"/>`,
          )
          .join("");
        const stems = map._positions
          .map(
            (position) =>
              `<line x1="${position.x * 10}" y1="226" x2="${position.x * 10}" y2="295"/>`,
          )
          .join("");
        const laneCards = chapter()
          .modules.map(
            (module, index) =>
              `<button type="button" class="module-card swimlane" data-module="${module[0]}" aria-label="Inspect ${module[1]}"><small>${captions[theme]} ${String(index + 1).padStart(2, "0")}</small><strong>${module[1]}</strong><span>${module[2]}</span></button>`,
          )
          .join("");
        map.innerHTML = `<svg class="module-links swimlane-links" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true"><g>${stems}${routeLines}</g><line class="active-module-link" data-active-link/></svg><div class="swimlane-grid" style="--lane-count:${count}">${laneCards}</div><div class="route-line-caption" data-flow-caption aria-live="polite"><small>EVIDENCE MOVING</small><strong data-flow-packet></strong><span data-flow-change></span></div>`;
      } else {
        map._layout = null;
        map._positions = null;
        map.innerHTML = chapter()
          .modules.map(
            (module, index) =>
              `<button type="button" class="module-card" data-module="${module[0]}" aria-label="Inspect ${module[1]}"><small>${captions[theme] || "NODE"} ${String(index + 1).padStart(2, "0")}</small><strong>${module[1]}</strong><span>${module[2]}</span></button>`,
          )
          .join("");
      }
      $$(".module-card", map).forEach((card) =>
        card.addEventListener("click", () =>
          inspect(
            chapter().modules.find(
              (module) => module[0] === card.dataset.module,
            ),
          ),
        ),
      );
      renderStep();
    };
    const renderChapterTabs = () => {
      chapterTabs.innerHTML = data()
        .chapters.map(
          (item, index) =>
            `<button type="button" role="tab" aria-selected="${index === chapterIndex}" data-chapter="${index}"><small>FLOW ${String(index + 1).padStart(2, "0")}</small><span>${item.name.replace(/^[A-C] · /, "")}</span></button>`,
        )
        .join("");
      $$("[data-chapter]", chapterTabs).forEach((button) =>
        button.addEventListener("click", () => {
          stop();
          chapterIndex = Number(button.dataset.chapter);
          stepIndex = 0;
          render();
          start();
        }),
      );
    };
    const render = () => {
      [...root.classList]
        .filter((className) => className.startsWith("flow-layout-"))
        .forEach((className) => root.classList.remove(className));
      root.classList.add(`flow-layout-${data().theme || "frevdesk"}`);
      productTabs.forEach((tab) =>
        tab.setAttribute(
          "aria-selected",
          String(tab.dataset.flowProduct === productKey),
        ),
      );
      if (productSelect) productSelect.value = productKey;
      if (productIndex)
        productIndex.textContent = `PRODUCT ${String(productKeys.indexOf(productKey) + 1).padStart(2, "0")} / ${String(productKeys.length).padStart(2, "0")}`;
      const label = $(".flow-product-label", root);
      const title = $(".showcase-heading h2", root);
      const description = $(".flow-description", root);
      const cta = $(".flow-cta", root);
      if (label) label.textContent = data().label;
      if (title) title.textContent = data().title;
      if (description)
        description.textContent = `${data().description} ${chapter().note}`;
      if (cta) {
        cta.href = data().cta[1];
        cta.firstChild.textContent = `${data().cta[0]} `;
      }
      const selectionLabel = $(
        ".module-inspector > div:first-child span",
        root,
      );
      if (selectionLabel)
        selectionLabel.textContent =
          data().theme === "frevdesk" ? "SELECTED GROUP" : "SELECTED MODULE";
      if (detail)
        $(":scope > span", detail).textContent =
          data().theme === "frevdesk" ? "GROUP" : "MODULE";
      renderChapterTabs();
      renderMap();
      if (inspector) inspect(chapter().modules[0]);
    };
    const next = () => {
      stepIndex = (stepIndex + 1) % chapter().steps.length;
      renderStep();
    };
    const start = () => {
      if (reducedMotion || timer) return;
      playing = true;
      renderStep();
      timer = setInterval(next, data().theme === "frevdesk" ? 6500 : 4500);
    };
    const switchProduct = (key) => {
      stop();
      productKey = key;
      localStorage.setItem("frevo-preview-product", productKey);
      chapterIndex = 0;
      stepIndex = 0;
      render();
      start();
    };
    productTabs.forEach((tab) =>
      tab.addEventListener("click", () =>
        switchProduct(tab.dataset.flowProduct),
      ),
    );
    if (productSelect)
      productSelect.addEventListener("change", () =>
        switchProduct(productSelect.value),
      );
    const previousProduct = $("[data-flow-prev]", root);
    const nextProduct = $("[data-flow-next]", root);
    if (previousProduct)
      previousProduct.addEventListener("click", () =>
        switchProduct(
          productKeys[
            (productKeys.indexOf(productKey) - 1 + productKeys.length) %
              productKeys.length
          ],
        ),
      );
    if (nextProduct)
      nextProduct.addEventListener("click", () =>
        switchProduct(
          productKeys[
            (productKeys.indexOf(productKey) + 1) % productKeys.length
          ],
        ),
      );
    if (detail)
      $("button", detail).addEventListener("click", () =>
        detail.classList.remove("open"),
      );
    render();
    return { start, stop };
  };

  const showcase = $("[data-flow-showcase]");
  if (showcase) {
    const controller = createFlowController(showcase);
    const flowObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) controller.start();
          else controller.stop();
        }),
      { threshold: 0.35 },
    );
    flowObserver.observe(showcase);
  }

  $$("[data-module-explorer]").forEach((explorer) => {
    explorer.innerHTML = `<div class="showcase-heading"><div><span class="flow-product-label"></span><h2></h2></div><p class="flow-description"></p></div><div class="showcase-chapters" role="tablist" aria-label="Choose a scenario"></div><div class="flow-canvas"><div class="flow-result" aria-live="polite"><span>WHAT CHANGES</span><p></p></div><div class="module-map" aria-live="polite"></div></div><div class="packet-lane" aria-live="polite"><span class="packet-source"></span><i aria-hidden="true"><b></b></i><strong class="packet-label"></strong><span class="packet-destination"></span></div><div class="module-inspector" aria-live="polite"><div><span>SELECTED MODULE</span><strong data-inspect-name></strong></div><div><span>RECEIVES</span><p data-inspect-input></p></div><div><span>PRODUCES</span><p data-inspect-output></p></div></div><div class="showcase-footer"><span class="flow-progress"></span></div>`;
    const controller = createFlowController(
      explorer,
      explorer.dataset.moduleExplorer,
    );
    const explorerObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) controller.start();
          else controller.stop();
        }),
      { threshold: 0.2 },
    );
    explorerObserver.observe(explorer);
  });

  const compactStories = {
    frevone: {
      label: "FrevOne / Complete HRMS",
      title: "One easy journey from hire to retire.",
      problem:
        "HR operations become slow and inconsistent when hiring, employee records, attendance, payroll, approvals and exits run across disconnected tools.",
      explanation:
        "FrevOne brings recruitment, onboarding, employee management, self-service, time, payroll and exit workflows into one easy-to-use automated HRMS.",
      outcome:
        "A simpler, automated hire-to-retire experience with one dependable workforce record.",
      record: "Employee journey / Hire to retire",
      href: "/products/frevone/",
      link: "Explore FrevOne",
      steps: [
        [
          "01",
          "Hire & onboard",
          "Move a selected candidate into a structured employee onboarding journey.",
          "Employee record created",
        ],
        [
          "02",
          "Manage & engage",
          "Keep employee data, self-service requests and approvals connected.",
          "One current workforce record",
        ],
        [
          "03",
          "Run time & pay",
          "Bring leave, attendance, policy and payroll inputs into a governed flow.",
          "Reviewed payroll outcome",
        ],
        [
          "04",
          "Transition & retain history",
          "Complete configured exit actions while preserving the authorized employee history.",
          "Hire-to-retire journey retained",
        ],
      ],
    },
    frevdesk: {
      label: "FrevDesk / IT service & assets",
      title: "A ticket gets an owner before it gets lost.",
      problem:
        "Unstructured requests make ownership, response targets and progress difficult to see.",
      explanation:
        "FrevDesk classifies the request, assigns the responsible queue and keeps the SLA alongside the work.",
      outcome: "Visible ownership, service commitments and lifecycle history.",
      record: "INC-284 / Network access",
      href: "/products/frevdesk/",
      link: "Explore FrevDesk",
      steps: [
        [
          "01",
          "Request captured",
          "The portal records the requester and issue details.",
          "Ticket created",
        ],
        [
          "02",
          "Work classified",
          "Access & Identity and Medium priority are applied.",
          "Category and priority added",
        ],
        [
          "03",
          "Owner assigned",
          "Access Operations becomes the accountable team.",
          "Owner and 8-hour SLA added",
        ],
        [
          "04",
          "Resolution tracked",
          "Updates and closure remain on the same service record.",
          "Status changed to Resolved",
        ],
      ],
    },
    frevguard: {
      label: "FrevGuard / Permit to work",
      title: "Evidence reaches authority before work starts.",
      problem:
        "A permit decision is unsafe when required field evidence is fragmented or incomplete.",
      explanation:
        "FrevGuard brings risk, isolation and gas-test evidence to an authorized reviewer and records the human decision.",
      outcome:
        "Controlled work backed by visible evidence and accountable authorization.",
      record: "PTW-192 / Hot work",
      href: "/products/frevguard/",
      link: "Explore FrevGuard",
      steps: [
        [
          "01",
          "Permit requested",
          "Job scope, location and people are recorded.",
          "Draft permit created",
        ],
        [
          "02",
          "Controls evidenced",
          "Risk controls, isolation and gas-test results are attached.",
          "Evidence set completed",
        ],
        [
          "03",
          "Authority reviews",
          "The authorized person sees the evidence and conditions.",
          "Awaiting human decision",
        ],
        [
          "04",
          "Decision recorded",
          "Approval is recorded with validity and conditions.",
          "Permit status changed to Issued",
        ],
      ],
    },
  };

  const compactDemo = $("[data-product-demo]");
  if (compactDemo) {
    let key = "frevone";
    let step = 0;
    let timer = null;
    let lastRenderedKey = "";
    const tabs = $$("[data-demo-product]", compactDemo);
    const productKeys = tabs.map((tab) => tab.dataset.demoProduct);
    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stopDemo = () => {
      clearInterval(timer);
      timer = null;
      compactDemo.classList.remove("is-playing");
    };
    const renderDemo = () => {
      const story = compactStories[key];
      const current = story.steps[step];
      tabs.forEach((tab) =>
        tab.setAttribute(
          "aria-selected",
          String(tab.dataset.demoProduct === key),
        ),
      );
      if (
        lastRenderedKey &&
        lastRenderedKey !== key &&
        window.matchMedia("(max-width: 760px)").matches
      ) {
        tabs
          .find((tab) => tab.dataset.demoProduct === key)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
      lastRenderedKey = key;
      $("[data-demo-label]", compactDemo).textContent = story.label;
      $("[data-demo-title]", compactDemo).textContent = story.title;
      $("[data-demo-problem]", compactDemo).textContent = story.problem;
      $("[data-demo-explanation]", compactDemo).textContent = story.explanation;
      $("[data-demo-name]", compactDemo).textContent =
        story.name || story.label.split(" / ")[0];
      $("[data-demo-outcome]", compactDemo).textContent = story.outcome;
      $("[data-demo-record]", compactDemo).textContent = story.record;
      $("[data-demo-stage]", compactDemo).textContent = current[1];
      $("[data-demo-detail]", compactDemo).textContent = current[2];
      $("[data-demo-change]", compactDemo).textContent = current[3];
      $("[data-demo-progress]", compactDemo).textContent =
        `${current[0]} / ${String(story.steps.length).padStart(2, "0")}`;
      $("[data-demo-step-track]", compactDemo).innerHTML = story.steps
        .map(
          (item, index) =>
            `<i class="${index < step ? "is-complete" : index === step ? "is-active" : ""}"><span>${item[0]}</span></i>`,
        )
        .join("");
      const link = $("[data-demo-link]", compactDemo);
      link.href = story.href;
      link.firstChild.textContent = `${story.link} `;
      compactDemo.classList.remove("is-playing");
      void compactDemo.offsetWidth;
      if (timer && !reducedMotion) compactDemo.classList.add("is-playing");
    };
    const advance = () => {
      if (step < compactStories[key].steps.length - 1) {
        step += 1;
        renderDemo();
      } else {
        const nextProduct = (productKeys.indexOf(key) + 1) % productKeys.length;
        key = productKeys[nextProduct];
        step = 0;
        renderDemo();
      }
    };
    const startDemo = () => {
      if (reducedMotion || timer) return;
      compactDemo.classList.add("is-playing");
      timer = setInterval(advance, 4800);
    };
    tabs.forEach((tab) =>
      tab.addEventListener("click", () => {
        stopDemo();
        key = tab.dataset.demoProduct;
        step = 0;
        renderDemo();
        startDemo();
      }),
    );
    const demoObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) startDemo();
          else stopDemo();
        }),
      { threshold: 0.15 },
    );
    demoObserver.observe(compactDemo);
    renderDemo();
  }

  const engineeringServices = {
    erp: {
      category: "ERP integration",
      title: "Bring ERP information into your operational applications.",
      copy: "Connect selected business information to the applications where teams perform day-to-day work, with validation and exceptions kept visible.",
      visual:
        '<div class="integration-flow"><div><span>SOURCE SYSTEM</span><strong>Your ERP</strong><small>SAP / Oracle</small></div><i aria-hidden="true"><b></b></i><div class="integration-core"><span>CONTROLLED LAYER</span><strong>Integration</strong><small>Map &middot; validate &middot; monitor</small></div><i aria-hidden="true"><b></b></i><div><span>DESTINATION</span><strong>Business app</strong><small>Operational workflow</small></div></div>',
      scope: ["Field mapping", "Validation", "Exception handling"],
      cta: "Discuss an integration",
      href: "mailto:info@frevo.co.in?subject=ERP%20integration%20enquiry",
      note: "Illustrative scope only. Systems, interfaces and ownership are confirmed during discovery.",
    },
    data: {
      category: "Data & analytics",
      title: "Turn operational records into reports teams can use.",
      copy: "Bring information from relevant sources into a reporting view that makes workload, status and exceptions easier to understand.",
      visual:
        '<div class="report-example"><div class="report-example-top"><span>ILLUSTRATIVE REPORT / SAMPLE DATA</span><strong>Operations overview</strong></div><div class="report-example-grid"><div><span>Requests by category</span><i style="--sample-bar:78%"><b></b></i><i style="--sample-bar:55%"><b></b></i><i style="--sample-bar:34%"><b></b></i></div><div><span>Views prepared for</span><strong>Workload</strong><strong>Service status</strong><strong>Exceptions</strong></div></div></div>',
      scope: ["Data model", "Operational dashboard", "Scheduled reports"],
      cta: "Discuss your reporting needs",
      href: "mailto:info@frevo.co.in?subject=Data%20and%20analytics%20enquiry",
      note: "Illustrative report using sample data. Measures and source systems are defined for the agreed reporting need.",
    },
    ai: {
      category: "AI & automation",
      title: "Structure document information for accountable review.",
      copy: "Use automation to prepare information from a document, apply configured validation and present the result to an authorized reviewer.",
      visual:
        '<div class="automation-example"><div><span>INPUT</span><strong>Business document</strong><small>Illustrative source</small></div><i aria-hidden="true"><b></b></i><div><span>PREPARED OUTPUT</span><strong>Structured fields</strong><small>Validation flags retained</small></div><i aria-hidden="true"><b></b></i><div class="human-review"><span>ACCOUNTABLE STEP</span><strong>Human review</strong><small>No autonomous decision</small></div></div>',
      scope: ["Document extraction", "Validation rules", "Review workflow"],
      cta: "Explore an automation opportunity",
      href: "mailto:info@frevo.co.in?subject=AI%20and%20automation%20enquiry",
      note: "Illustrative workflow. Automation prepares information; the configured reviewer remains responsible for the decision.",
    },
    apps: {
      category: "Custom applications",
      title: "Build an internal application around a specific process.",
      copy: "Shape a focused application around the records, roles, reviews and integrations that make the operation work.",
      visual:
        '<div class="application-example"><div class="application-bar"><span>ILLUSTRATIVE INTERNAL APPLICATION</span><strong>Operational request</strong></div><div class="application-body"><aside><b>Request</b><span>Review</span><span>Decision</span></aside><div><small>REQUEST / OPS-104</small><strong>Equipment movement approval</strong><p><span>Submitted</span><span>Operations review</span><span>Decision recorded</span></p></div></div></div>',
      scope: ["Process discovery", "Role-based workflow", "System integration"],
      cta: "Discuss your application",
      href: "mailto:info@frevo.co.in?subject=Custom%20application%20enquiry",
      note: "Illustrative application brief, not a completed customer project. Scope is shaped during discovery.",
    },
  };

  const engineeringSection = $("[data-engineering-services]");
  if (engineeringSection) {
    const serviceTabs = $$("[data-service-key]", engineeringSection);
    const servicePanel = $("#service-example", engineeringSection);
    const selectService = (key, moveFocus = false, revealPanel = false) => {
      const service = engineeringServices[key];
      const activeTab = serviceTabs.find(
        (tab) => tab.dataset.serviceKey === key,
      );
      serviceTabs.forEach((tab) => {
        const selected = tab === activeTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      servicePanel.setAttribute("aria-labelledby", activeTab.id);
      $("[data-service-category]", servicePanel).textContent = service.category;
      $("[data-service-title]", servicePanel).textContent = service.title;
      $("[data-service-copy]", servicePanel).textContent = service.copy;
      $("[data-service-visual]", servicePanel).innerHTML = service.visual;
      $("[data-service-scope]", servicePanel).innerHTML = service.scope
        .map((item) => `<li>${item}</li>`)
        .join("");
      const cta = $("[data-service-cta]", servicePanel);
      cta.href = service.href;
      cta.firstChild.textContent = `${service.cta} `;
      $("[data-service-note]", servicePanel).textContent = service.note;
      servicePanel.classList.remove("is-refreshed");
      void servicePanel.offsetWidth;
      servicePanel.classList.add("is-refreshed");
      if (moveFocus) activeTab.focus();
      if (
        revealPanel &&
        window.matchMedia("(max-width: 600px)").matches
      ) {
        window.setTimeout(
          () => servicePanel.scrollIntoView({ behavior: "smooth", block: "start" }),
          60,
        );
      }
    };
    serviceTabs.forEach((tab, index) => {
      tab.addEventListener("click", () =>
        selectService(tab.dataset.serviceKey, false, true),
      );
      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (["ArrowDown", "ArrowRight"].includes(event.key))
          nextIndex = (index + 1) % serviceTabs.length;
        else if (["ArrowUp", "ArrowLeft"].includes(event.key))
          nextIndex = (index - 1 + serviceTabs.length) % serviceTabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = serviceTabs.length - 1;
        else return;
        event.preventDefault();
        selectService(serviceTabs[nextIndex].dataset.serviceKey, true);
      });
    });
  }

  const finderData = {
    workforce: [
      "FrevOne",
      "Bring attendance, payroll and approvals into one governed flow.",
      "FrevOne connects employee records, attendance inputs, exception review and Indian payroll with an auditable approval trail.",
      "/products/frevone/",
      "Explore FrevOne",
    ],
    policy: [
      "FrevOne",
      "Configure different workforce rules without fragmenting the platform.",
      "Client, location and workforce policies can be configured around the operating model while teams retain one consistent system.",
      "#policy-demo",
      "Try the policy example",
    ],
    support: [
      "FrevDesk",
      "Give every IT request a clear owner, priority and service target.",
      "FrevDesk brings intake, assignment, SLA tracking, resolution and history into one service workflow.",
      "/products/frevdesk/",
      "Explore FrevDesk",
    ],
    assets: [
      "FrevDesk",
      "Track assets from receipt and assignment through return or disposal.",
      "FrevDesk connects service activity with the people, locations and assets involved, creating a dependable lifecycle record.",
      "/products/frevdesk/#asset-workflow",
      "See asset workflow",
    ],
    integration: [
      "ERP integration",
      "Connect the systems already running your enterprise.",
      "Frevo provides specialist integration expertise across SAP, Oracle and connected enterprise applications without positioning itself as an ERP implementer.",
      "#services",
      "Explore services",
    ],
    custom: [
      "Enterprise software",
      "Build the specific operational application your process needs.",
      "Frevo combines product thinking, domain discovery and engineering to create focused business applications and integrations.",
      "#contact",
      "Discuss your process",
    ],
  };
  const finder = $("[data-finder]");
  if (finder) {
    const buttons = $$("[data-choice]", finder);
    const product = $(".recommendation-product", finder);
    const title = $(".recommendation h3", finder);
    const copy = $(".recommendation-copy", finder);
    const link = $(".recommendation-link", finder);
    const index = $(".recommendation-index", finder);
    const select = (key) => {
      const data = finderData[key];
      buttons.forEach((button) =>
        button.setAttribute(
          "aria-checked",
          String(button.dataset.choice === key),
        ),
      );
      [product.textContent, title.textContent, copy.textContent] = data;
      link.href = data[3];
      link.firstChild.textContent = `${data[4]} `;
      index.textContent = `${String(buttons.findIndex((button) => button.dataset.choice === key) + 1).padStart(2, "0")} / 06`;
    };
    buttons.forEach((button) =>
      button.addEventListener("click", () => select(button.dataset.choice)),
    );
    $("[data-finder-reset]", finder).addEventListener("click", () =>
      select("workforce"),
    );
  }

  const policy = $("[data-policy-demo]");
  if (policy) {
    if (policy.hasAttribute("data-policy-hero")) {
      const choices = $$("[data-policy-client]", policy);
      const selectPolicy = (client) => {
        const isClientA = client === "a";
        choices.forEach((button) => {
          const active = button.dataset.policyClient === client;
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        $("[data-policy-client-label]", policy).textContent = isClientA
          ? "CLIENT A RESULT"
          : "CLIENT B RESULT";
        const status = $("[data-policy-status]", policy);
        status.textContent = isClientA ? "Late" : "Within grace";
        status.className = `status ${isClientA ? "status-late" : "status-good"}`;
        $("[data-policy-outcome]", policy).textContent = isClientA
          ? "2 minutes beyond grace"
          : "3 minutes remaining within grace";
        $("[data-policy-detail]", policy).textContent =
          `The 09:12 event is evaluated against ${isClientA ? "Client A's assigned 10-minute" : "Client B's assigned 15-minute"} grace policy.`;
        $(".hero-example-result", policy).classList.remove("is-updating");
        void policy.offsetWidth;
        $(".hero-example-result", policy).classList.add("is-updating");
      };
      choices.forEach((button) =>
        button.addEventListener("click", () =>
          selectPolicy(button.dataset.policyClient),
        ),
      );
      selectPolicy("a");
    }
  }

  const ticket = $("[data-ticket-demo]");
  if (ticket) {
    if (ticket.hasAttribute("data-ticket-hero")) {
      const button = $("[data-ticket-route]", ticket);
      const result = $("[data-ticket-routing]", ticket);
      button.addEventListener("click", () => {
        const opening = result.hidden;
        result.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.firstChild.textContent = opening
          ? "Hide routing "
          : "See routing ";
        if (opening) {
          result.classList.remove("is-updating");
          void result.offsetWidth;
          result.classList.add("is-updating");
        }
      });
    }
  }

  const permitReview = $("[data-guard-review]");
  if (permitReview) {
    const button = $("[data-review-toggle]", permitReview);
    const context = $("[data-review-context]", permitReview);
    button.addEventListener("click", () => {
      const opening = context.hidden;
      context.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      button.firstChild.textContent = opening
        ? "Hide review context "
        : "View review context ";
      if (opening) {
        context.classList.remove("is-updating");
        void context.offsetWidth;
        context.classList.add("is-updating");
      }
    });
  }

  const deskHero = $("[data-desk-hero]");
  if (deskHero) {
    const scenes = [
      {
        status: "NEW",
        category: "Awaiting classification",
        owner: "Unassigned",
        icon: "IN",
        title: "Request captured",
        copy: "A structured service record is created from the employee portal.",
        team: "Not assigned",
        sla: "Not started",
        autoTitle: "Required information checked",
        autoCopy: "The request is ready for classification.",
        captionTitle: "One request becomes accountable work.",
        captionCopy:
          "FrevDesk creates a persistent record before routing begins.",
      },
      {
        status: "TRIAGED",
        category: "Access & Identity",
        owner: "Access Operations",
        icon: "CL",
        title: "Context classified",
        copy: "Category, service context and priority are applied to the request.",
        team: "Access Operations",
        sla: "8 business hours",
        autoTitle: "Classification suggested",
        autoCopy: "Service context routes the request to the right queue.",
        captionTitle: "Context determines the route.",
        captionCopy:
          "Classification applies the responsible queue and relevant service target.",
      },
      {
        status: "ASSIGNED",
        category: "Access & Identity",
        owner: "A. Nair",
        icon: "OW",
        title: "Ownership established",
        copy: "A named owner receives the work with its full request and asset context.",
        team: "Access Operations",
        sla: "07:42 remaining",
        autoTitle: "Owner and SLA applied",
        autoCopy: "The accountable owner is notified automatically.",
        captionTitle: "Responsibility is visible.",
        captionCopy:
          "The requester, service desk and owner now share the same operating record.",
      },
      {
        status: "IN PROGRESS",
        category: "Access & Identity",
        owner: "A. Nair",
        icon: "WK",
        title: "Work in progress",
        copy: "The technician works with the linked device and records each meaningful update.",
        team: "Access Operations",
        sla: "04:18 remaining",
        autoTitle: "Requester update sent",
        autoCopy: "Progress is communicated without a separate follow-up.",
        captionTitle: "Service work stays connected to the asset.",
        captionCopy:
          "Actions, communication and affected equipment remain in one traceable history.",
      },
      {
        status: "RESOLVED",
        category: "Access & Identity",
        owner: "A. Nair",
        icon: "OK",
        title: "Resolved with evidence",
        copy: "Resolution notes and service evidence close the request with a complete history.",
        team: "Access Operations",
        sla: "Met",
        autoTitle: "Closure confirmation queued",
        autoCopy: "The requester receives the outcome and resolution summary.",
        captionTitle: "The outcome is recorded, not merely reported.",
        captionCopy:
          "FrevDesk preserves ownership, timestamps and resolution evidence for review.",
      },
    ];
    const fields = {
      status: $("[data-desk-status]", deskHero),
      category: $("[data-desk-category]", deskHero),
      owner: $("[data-desk-owner]", deskHero),
      counter: $("[data-desk-counter]", deskHero),
      icon: $("[data-desk-action-icon]", deskHero),
      title: $("[data-desk-action-title]", deskHero),
      copy: $("[data-desk-action-copy]", deskHero),
      team: $("[data-desk-team]", deskHero),
      sla: $("[data-desk-sla]", deskHero),
      autoTitle: $("[data-desk-auto-title]", deskHero),
      autoCopy: $("[data-desk-auto-copy]", deskHero),
      captionStep: $("[data-desk-caption-step]", deskHero),
      captionTitle: $("[data-desk-caption-title]", deskHero),
      captionCopy: $("[data-desk-caption-copy]", deskHero),
    };
    const routeSteps = $$("[data-desk-route-step]", deskHero);
    let sceneIndex = 0;
    let sceneTimer;

    const renderDeskScene = (index) => {
      const scene = scenes[index];
      fields.status.textContent = scene.status;
      fields.category.textContent = scene.category;
      fields.owner.textContent = scene.owner;
      fields.counter.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
      fields.icon.textContent = scene.icon;
      fields.title.textContent = scene.title;
      fields.copy.textContent = scene.copy;
      fields.team.textContent = scene.team;
      fields.sla.textContent = scene.sla;
      fields.autoTitle.textContent = scene.autoTitle;
      fields.autoCopy.textContent = scene.autoCopy;
      fields.captionStep.textContent = String(index + 1).padStart(2, "0");
      fields.captionTitle.textContent = scene.captionTitle;
      fields.captionCopy.textContent = scene.captionCopy;
      routeSteps.forEach((step, stepIndex) => {
        step.classList.toggle("is-complete", stepIndex < index);
        step.classList.toggle("is-active", stepIndex === index);
      });
      deskHero.classList.remove("is-updating");
      void deskHero.offsetWidth;
      deskHero.classList.add("is-updating");
    };
    const stopDeskHero = () => {
      window.clearInterval(sceneTimer);
      sceneTimer = undefined;
    };
    const startDeskHero = () => {
      stopDeskHero();
      sceneIndex = 0;
      renderDeskScene(sceneIndex);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        renderDeskScene(scenes.length - 1);
        return;
      }
      sceneTimer = window.setInterval(() => {
        sceneIndex = (sceneIndex + 1) % scenes.length;
        renderDeskScene(sceneIndex);
      }, 4400);
    };

    const deskObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startDeskHero();
          else stopDeskHero();
        });
      },
      { threshold: 0.18 },
    );
    deskObserver.observe(deskHero);
  }

  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    let headerFrame;
    const updateCompactHeader = () => {
      siteHeader.classList.toggle("is-compact", window.scrollY > 120);
      headerFrame = undefined;
    };
    const requestHeaderUpdate = () => {
      if (headerFrame) return;
      headerFrame = window.requestAnimationFrame(updateCompactHeader);
    };
    updateCompactHeader();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  }

  const mobileMotionQuery = window.matchMedia("(max-width: 760px)");
  if (
    mobileMotionQuery.matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  ) {
    document.documentElement.classList.add("mobile-motion");
    const motionTargets = $$([
      ".portfolio-showcase",
      ".desk-feature-stage",
      ".desk-tour",
      ".asset-command",
      ".permit-lifecycle-board",
      ".handoff-board",
      ".reach-overview",
      ".payroll-stage",
    ].join(","));
    const mobileMotionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle(
            "is-mobile-visible",
            entry.isIntersecting,
          ),
        );
      },
      { rootMargin: "18% 0px", threshold: 0.05 },
    );
    motionTargets.forEach((target) => {
      target.classList.add("mobile-motion-target");
      mobileMotionObserver.observe(target);
    });
  }

  if (!document.querySelector(".whatsapp-contact")) {
    const whatsapp = document.createElement("a");
    whatsapp.className = "whatsapp-contact";
    whatsapp.href =
      "https://wa.me/919599377709?text=Hello%20Frevo%20Technologies%2C%20I%20would%20like%20to%20know%20more%20about%20your%20solutions.";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.setAttribute(
      "aria-label",
      "Contact Frevo Technologies on WhatsApp",
    );
    whatsapp.title = "Contact us on WhatsApp";
    whatsapp.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 11.5a8.4 8.4 0 0 1-12.5 7.3L3.5 20l1.2-4.2a8.4 8.4 0 1 1 15.7-4.3Z"></path>
        <path d="M8.1 7.7c.2-.4.4-.4.7-.4h.5l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.6 1.1 1.5 2 2.7 2.6.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 .7-.3 1.4-.8 1.8-.5.4-1.2.7-2 .6-1.2-.2-2.8-.7-4.7-2.4-1.5-1.4-2.5-3.1-2.8-4.4-.3-.9 0-1.5.3-1.9.2-.3.5-.5.7-.7Z"></path>
      </svg>
      <span>WhatsApp us</span>`;
    document.body.append(whatsapp);
  }
})();
