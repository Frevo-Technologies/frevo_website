(() => {
  const stages = [
    {
      status: "Request captured",
      kicker: "REQUEST & SCOPE",
      title: "Define the work before it reaches the field.",
      copy: "Job, location, timing, people and permit type are captured in one controlled request.",
      area: "Utilities / P-14",
      role: "Permit requester",
      evidence: "Scope and work party",
      event: "Draft permit PTW-192 created",
      time: "08:10",
    },
    {
      status: "Controls prepared",
      kicker: "HAZARD ASSESSMENT",
      title: "Turn known hazards into explicit controls.",
      copy: "Hot-work hazards, required precautions and accountable checks are assembled before review.",
      area: "Hot-work zone established",
      role: "Field control",
      evidence: "Hazards and safeguards",
      event: "Control checklist completed",
      time: "08:24",
    },
    {
      status: "Evidence verified",
      kicker: "ISOLATION & TESTING",
      title: "Attach field evidence to the same permit.",
      copy: "Isolation LOTO-48 and the time-stamped atmospheric result remain visible in permit context.",
      area: "Process line P-14 isolated",
      role: "Isolating authority",
      evidence: "LOTO-48 / gas test 08:42",
      event: "Required evidence verified",
      time: "08:44",
    },
    {
      status: "Authorized",
      kicker: "HUMAN AUTHORIZATION",
      title: "Present complete context to the accountable authority.",
      copy: "The system validates readiness; the authorized person reviews evidence and records the decision.",
      area: "Utilities / controlled boundary",
      role: "Area authority",
      evidence: "Decision and conditions",
      event: "Permit authorized with conditions",
      time: "08:58",
    },
    {
      status: "Permit active",
      kicker: "FIELD EXECUTION",
      title: "Keep validity and operating conditions visible.",
      copy: "The work party sees current permit status while operations can track active, expiring or suspended work.",
      area: "Work zone active",
      role: "Performing authority",
      evidence: "Briefing and acknowledgement",
      event: "Work party acknowledged permit",
      time: "09:05",
    },
    {
      status: "Closed safely",
      kicker: "HAND-BACK & CLOSURE",
      title: "Close the work without losing its history.",
      copy: "Completion, site condition, hand-back and closure are recorded against the original permit identity.",
      area: "Area returned to operations",
      role: "Control room",
      evidence: "Safe hand-back recorded",
      event: "PTW-192 closed with audit record",
      time: "14:18",
    },
  ];

  const setText = (root, selector, value) => {
    root.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const updateCycle = (root, index) => {
    const stage = stages[index];
    setText(root, "[data-guard-status]", stage.status);
    setText(
      root,
      "[data-guard-count]",
      `${String(index + 1).padStart(2, "0")} / 06`,
    );
    setText(root, "[data-guard-kicker]", stage.kicker);
    setText(root, "[data-guard-title]", stage.title);
    setText(root, "[data-guard-copy]", stage.copy);
    setText(root, "[data-guard-area]", stage.area);
    setText(root, "[data-guard-role]", stage.role);
    setText(root, "[data-guard-evidence]", stage.evidence);
    setText(root, "[data-guard-event]", stage.event);
    setText(root, "[data-guard-time]", stage.time);

    root
      .querySelectorAll(".guard-phase-track span, .permit-route article")
      .forEach((item, itemIndex) => {
        item.classList.toggle("is-active", itemIndex === index);
        item.classList.toggle("is-complete", itemIndex < index);
      });

    const progress = root.querySelector("[data-guard-progress]");
    if (progress) progress.style.width = `${index * 20}%`;
  };

  document.querySelectorAll("[data-guard-cycle]").forEach((root) => {
    let index = 0;
    let timer = null;
    const start = () => {
      if (
        timer ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      updateCycle(root, index);
      timer = window.setInterval(() => {
        index = (index + 1) % stages.length;
        updateCycle(root, index);
      }, 4600);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0.18 },
      );
      observer.observe(root);
    } else {
      start();
    }
  });

  const controlTypes = {
    hot: {
      title: "Hot-work control set",
      checks: [
        "Combustibles removed or protected",
        "Fire watch assigned",
        "Isolation reference attached",
        "Atmospheric test within limit",
      ],
      rule: "4 required checks + authorized review",
      score: "100",
    },
    confined: {
      title: "Confined-space control set",
      checks: [
        "Entry boundary identified",
        "Atmospheric testing recorded",
        "Standby person assigned",
        "Rescue arrangement confirmed",
      ],
      rule: "4 required checks + entry authorization",
      score: "100",
    },
    height: {
      title: "Work-at-height control set",
      checks: [
        "Access method approved",
        "Fall protection inspected",
        "Drop zone controlled",
        "Weather condition accepted",
      ],
      rule: "4 required checks + supervisor review",
      score: "100",
    },
    electrical: {
      title: "Electrical-work control set",
      checks: [
        "Source identification confirmed",
        "Isolation and lockout recorded",
        "Absence of voltage verified",
        "Authorized electrician assigned",
      ],
      rule: "4 required checks + electrical authority review",
      score: "100",
    },
  };

  const workbench = document.querySelector(".control-workbench");
  if (workbench) {
    const buttons = [...workbench.querySelectorAll("[data-control-tab]")];
    const labels = [
      ...workbench.querySelectorAll("[data-control-checks] label"),
    ];
    let activeIndex = 0;
    let timer;

    const selectControl = (key) => {
      const control = controlTypes[key];
      if (!control) return;
      buttons.forEach((button, index) => {
        const selected = button.dataset.controlTab === key;
        button.classList.toggle("is-active", selected);
        if (selected) activeIndex = index;
      });
      setText(workbench, "[data-control-title]", control.title);
      setText(workbench, "[data-control-rule]", control.rule);
      setText(workbench, "[data-control-score]", control.score);
      labels.forEach((label, index) => {
        const textNode = [...label.childNodes].find(
          (node) => node.nodeType === Node.TEXT_NODE,
        );
        if (textNode) textNode.textContent = control.checks[index];
      });
      workbench.classList.remove("is-updating");
      requestAnimationFrame(() => workbench.classList.add("is-updating"));
    };

    const restart = () => {
      window.clearInterval(timer);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % buttons.length;
        selectControl(buttons[activeIndex].dataset.controlTab);
      }, 5600);
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        selectControl(button.dataset.controlTab);
        restart();
      });
    });
    selectControl(buttons[0].dataset.controlTab);
    restart();
  }
})();
