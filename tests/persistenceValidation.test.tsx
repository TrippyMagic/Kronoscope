// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { BirthDateProvider, useBirthDate } from "../src/context/BirthDateContext";
import { PreferencesProvider, usePreferences } from "../src/context/PreferencesContext";
import { UserProfileProvider, useUserProfile } from "../src/context/UserProfileContext";

function BirthProbe() {
  const { birthDate, birthTime } = useBirthDate();
  return (
    <output>
      {birthDate ? birthDate.toISOString() : "no-date"} / {birthTime}
    </output>
  );
}

function PreferencesProbe() {
  const { activeCategories, show3D, timescalesTab, visibleTimelineLanes } = usePreferences();
  return (
    <output>
      {[...activeCategories].sort().join(",")} / {String(show3D)} / {timescalesTab} / {[...visibleTimelineLanes].sort().join(",")}
    </output>
  );
}

function ProfileProbe() {
  const { profile } = useUserProfile();
  return <output>{JSON.stringify(profile)}</output>;
}

describe("persisted state validation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("ignores invalid persisted birth date and time values", () => {
    localStorage.setItem("dob", "not-a-date");
    localStorage.setItem("dobTime", "99:99");

    render(
      <BirthDateProvider>
        <BirthProbe />
      </BirthDateProvider>,
    );

    expect(screen.getByText("no-date / 00:00")).toBeTruthy();
  });

  it("normalizes malformed preference values to safe defaults", () => {
    localStorage.setItem("pref_eventCategories", JSON.stringify(["space", "bad-category"]));
    localStorage.setItem("pref_show3D", JSON.stringify("yes"));
    localStorage.setItem("pref_timescalesTab", JSON.stringify("missing"));
    localStorage.setItem("pref_visibleTimelineLanes", JSON.stringify(["historical", "bad-lane"]));

    render(
      <PreferencesProvider>
        <PreferencesProbe />
      </PreferencesProvider>,
    );

    expect(screen.getByText("space / false / overview / global")).toBeTruthy();
  });

  it("drops unknown and out-of-range profile values from storage", () => {
    localStorage.setItem("user_profile", JSON.stringify({
      restingHeartRate: 72,
      height: 999,
      weight: 70,
      activityLevel: "extreme",
      screenHoursPerDay: 4,
      unknown: true,
    }));

    render(
      <UserProfileProvider>
        <ProfileProbe />
      </UserProfileProvider>,
    );

    expect(screen.getByText(JSON.stringify({
      restingHeartRate: 72,
      weight: 70,
      screenHoursPerDay: 4,
    }))).toBeTruthy();
  });
});
