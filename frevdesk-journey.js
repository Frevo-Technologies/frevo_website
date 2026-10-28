(() => {
  const tour = document.querySelector("[data-desk-tour]");
  if (!tour) return;

  const panels = [...tour.querySelectorAll("[data-tour-panel]")];
  const progressSteps = [...tour.querySelectorAll("[data-tour-step]")];
  const actionOptions = [...tour.querySelectorAll("[data-action-option]")];
  const emailPanel = tour.querySelector('[data-tour-panel="email"]');
  const emailText = tour.querySelector("[data-tour-email-text]");
  const fields = {
    count: tour.querySelector("[data-tour-count]"),
    title: tour.querySelector("[data-tour-title]"),
    state: tour.querySelector("[data-tour-state]"),
    narrationStep: tour.querySelector("[data-tour-narration-step]"),
    narrationTitle: tour.querySelector("[data-tour-narration-title]"),
    narrationCopy: tour.querySelector("[data-tour-narration-copy]"),
    actionSla: tour.querySelector("[data-action-sla]"),
    actionNote: tour.querySelector("[data-action-note]"),
    actionEvent: tour.querySelector("[data-action-event]"),
    actionCopy: tour.querySelector("[data-action-copy]"),
  };

  const scenes = [
    {
      panel: "email",
      step: 0,
      title: "Email request arrives",
      state: "INCOMING",
      narrationTitle: "A request begins in the channel the user already knows.",
      narrationCopy:
        "FrevDesk watches the support inbox without asking the requester to repeat the issue.",
    },
    {
      panel: "ticket",
      step: 1,
      title: "A service record is created",
      state: "NEW",
      narrationTitle: "The email becomes a structured, trackable ticket.",
      narrationCopy:
        "Requester, source, subject, message and attachments remain connected to INC-284.",
    },
    {
      panel: "classify",
      step: 2,
      title: "Context drives classification",
      state: "CLASSIFIED",
      narrationTitle:
        "The right service context is applied before work begins.",
      narrationCopy:
        "Category, impact, priority and the applicable SLA policy are visible and reviewable.",
    },
    {
      panel: "assign",
      step: 3,
      title: "The right technician takes ownership",
      state: "ASSIGNED",
      narrationTitle: "Assignment considers skill, queue and current workload.",
      narrationCopy:
        "Arjun receives the full record while the requester sees who owns the outcome.",
    },
    {
      panel: "action",
      step: 4,
      action: "working",
      title: "Technician starts work",
      state: "WORKING",
      sla: "07:42 remaining",
      note: "VPN entitlement checked. Preparing the approved access profile.",
      event: "Work started",
      eventCopy: "Requester can see that the technician is working.",
      narrationTitle: "Work notes and status stay on the service record.",
      narrationCopy:
        "The team can see what has been checked and how much service time remains.",
    },
    {
      panel: "action",
      step: 4,
      action: "waiting",
      title: "Customer action is requested",
      state: "AWAITING CUSTOMER",
      sla: "06:58 remaining",
      note: "Identity confirmation requested from Meera before access can be activated.",
      event: "Email sent automatically",
      eventCopy:
        "The reply will return to this same ticket and communication log.",
      narrationTitle: "A dependency is explicit, not buried in an inbox.",
      narrationCopy:
        "The selected status explains why work is waiting and automatically contacts the requester.",
    },
    {
      panel: "action",
      step: 4,
      action: "resolved",
      title: "The technician resolves the request",
      state: "RESOLVED",
      sla: "Met - 05:38 remaining",
      note: "VPN profile activated and successful connection confirmed with the requester.",
      event: "Resolution confirmation sent",
      eventCopy:
        "Resolution notes and the SLA result are preserved for review.",
      narrationTitle: "Resolution closes the work with evidence.",
      narrationCopy:
        "The outcome, technician notes, communication and SLA result are retained together.",
    },
    {
      panel: "report",
      step: 5,
      title: "Service performance becomes visible",
      state: "REPORTING",
      narrationTitle: "Operational reporting keeps the columns that matter.",
      narrationCopy:
        "Ticket, requester, category, priority, owner, timestamps, status and SLA can be reviewed together.",
    },
    {
      panel: "history",
      step: 6,
      title: "Every interaction remains traceable",
      state: "COMPLETE HISTORY",
      narrationTitle: "One chronology explains the entire service experience.",
      narrationCopy:
        "Emails, system decisions, technician updates and requester responses form one auditable log.",
    },
  ];

  const emailMessage =
    "Hello Support,\n\nI need VPN access for a client visit tomorrow. Please help me activate it on my assigned laptop.\n\nRegards,\nMeera";
  let sceneIndex = 0;
  let sceneTimer;
  let typingTimer;
  let sendingTimer;

  const stopTyping = () => {
    window.clearInterval(typingTimer);
    window.clearTimeout(sendingTimer);
    typingTimer = undefined;
    sendingTimer = undefined;
  };

  const typeEmail = () => {
    stopTyping();
    emailText.textContent = "";
    emailPanel.classList.remove("is-sending");
    let characterIndex = 0;
    typingTimer = window.setInterval(() => {
      characterIndex += 1;
      emailText.textContent = emailMessage.slice(0, characterIndex);
      if (characterIndex >= emailMessage.length) {
        window.clearInterval(typingTimer);
        typingTimer = undefined;
        sendingTimer = window.setTimeout(
          () => emailPanel.classList.add("is-sending"),
          550,
        );
      }
    }, 28);
  };

  const renderScene = (index) => {
    const scene = scenes[index];
    panels.forEach((panel) =>
      panel.classList.toggle(
        "is-active",
        panel.dataset.tourPanel === scene.panel,
      ),
    );
    progressSteps.forEach((step, progressIndex) => {
      step.classList.toggle("is-complete", progressIndex < scene.step);
      step.classList.toggle("is-active", progressIndex === scene.step);
    });
    const progress = tour.querySelector(".desk-tour-progress");
    if (progress) progress.dataset.activeLabel = scene.title;
    fields.count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    fields.title.textContent = scene.title;
    fields.state.textContent = scene.state;
    fields.narrationStep.textContent = String(scene.step + 1).padStart(2, "0");
    fields.narrationTitle.textContent = scene.narrationTitle;
    fields.narrationCopy.textContent = scene.narrationCopy;

    actionOptions.forEach((option) =>
      option.classList.toggle(
        "is-selected",
        option.dataset.actionOption === scene.action,
      ),
    );
    if (scene.panel === "action") {
      fields.actionSla.textContent = scene.sla;
      fields.actionNote.textContent = scene.note;
      fields.actionEvent.textContent = scene.event;
      fields.actionCopy.textContent = scene.eventCopy;
    }

    if (scene.panel === "email") typeEmail();
    else stopTyping();
  };

  const stopTour = () => {
    window.clearInterval(sceneTimer);
    sceneTimer = undefined;
    stopTyping();
  };

  const startTour = () => {
    stopTour();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    sceneIndex = reducedMotion ? scenes.length - 1 : 0;
    renderScene(sceneIndex);
    if (reducedMotion) return;
    sceneTimer = window.setInterval(() => {
      sceneIndex = (sceneIndex + 1) % scenes.length;
      renderScene(sceneIndex);
    }, 6500);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startTour();
        else stopTour();
      });
    },
    { threshold: 0.16 },
  );

  observer.observe(tour);

  const assetDemo = document.querySelector("[data-asset-demo]");
  if (assetDemo) {
    const assetModes = {
      hardware: {
        kicker: "HARDWARE CONTROL",
        total: "2,486",
        label: "physical asset records",
        verified: "96%",
        alerts: "17",
        discovered: "2,341",
        title: "Hardware assets",
        noteTitle: "Endpoint evidence is current",
        noteCopy:
          "Identity, hardware and installed software are reconciled with governed records.",
        source: "2,341 endpoints reporting",
        method: "Windows utility + site gateway",
        action: "Identity matched to asset record",
        matched: "2,314 matched",
        review: "27 review",
      },
      software: {
        kicker: "SOFTWARE CONTROL",
        total: "74",
        label: "software and licence records",
        verified: "92%",
        alerts: "3",
        discovered: "2,341",
        title: "Software & licences",
        noteTitle: "Entitlement meets discovered use",
        noteCopy:
          "Licence position combines entitlement, assignment and endpoint discovery evidence.",
        source: "2,341 software inventories received",
        method: "Installed software from reporting endpoints",
        action: "Detected use compared with entitlement",
        matched: "71 compliant",
        review: "3 review",
      },
    };
    const buttons = [...assetDemo.querySelectorAll("[data-asset-mode]")];
    const assetPanels = [...assetDemo.querySelectorAll("[data-asset-panel]")];
    const assetFields = {
      kicker: assetDemo.querySelector("[data-asset-kicker]"),
      total: assetDemo.querySelector("[data-asset-total]"),
      label: assetDemo.querySelector("[data-asset-label]"),
      verified: assetDemo.querySelector("[data-asset-verified]"),
      alerts: assetDemo.querySelector("[data-asset-alerts]"),
      discovered: assetDemo.querySelector("[data-asset-discovered]"),
      title: assetDemo.querySelector("[data-asset-view-title]"),
      noteTitle: assetDemo.querySelector("[data-asset-note-title]"),
      noteCopy: assetDemo.querySelector("[data-asset-note-copy]"),
      source: assetDemo.querySelector("[data-discovery-source]"),
      method: assetDemo.querySelector("[data-discovery-method]"),
      action: assetDemo.querySelector("[data-discovery-action]"),
      matched: assetDemo.querySelector("[data-discovery-matched]"),
      review: assetDemo.querySelector("[data-discovery-review]"),
    };
    let assetMode = "hardware";
    let assetTimer;

    const renderAssetMode = (mode) => {
      const data = assetModes[mode];
      assetMode = mode;
      Object.entries(assetFields).forEach(([key, element]) => {
        element.textContent = data[key];
      });
      buttons.forEach((button) =>
        button.setAttribute(
          "aria-selected",
          String(button.dataset.assetMode === mode),
        ),
      );
      assetPanels.forEach((panel) =>
        panel.classList.toggle("is-active", panel.dataset.assetPanel === mode),
      );
    };

    const stopAssetDemo = () => {
      window.clearInterval(assetTimer);
      assetTimer = undefined;
    };
    const startAssetDemo = () => {
      stopAssetDemo();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      assetTimer = window.setInterval(() => {
        renderAssetMode(assetMode === "hardware" ? "software" : "hardware");
      }, 5600);
    };

    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        renderAssetMode(button.dataset.assetMode);
        startAssetDemo();
      }),
    );
    renderAssetMode(assetMode);

    const assetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startAssetDemo();
          else stopAssetDemo();
        });
      },
      { threshold: 0.2 },
    );
    assetObserver.observe(assetDemo);
  }
})();
