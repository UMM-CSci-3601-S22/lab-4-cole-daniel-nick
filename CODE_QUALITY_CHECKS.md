# Code quality checks <!-- omit in toc -->

- [What analysis tools are we using and why?](#what-analysis-tools-are-we-using-and-why)
  - [Better Code Hub](#better-code-hub)
  - [LGTM ("Looks Good To Me")](#lgtm-looks-good-to-me)
  - [What to do if you don't understand an alert?](#what-to-do-if-you-dont-understand-an-alert)
- [Code quality badges](#code-quality-badges)
  - [Updating the badges](#updating-the-badges)
    - [GitHub Actions build statuses](#github-actions-build-statuses)
    - [Better Code Hub and LGTM badges](#better-code-hub-and-lgtm-badges)
- [Enabling pull request checks](#enabling-pull-request-checks)
  - [Better Code Hub pull request checks](#better-code-hub-pull-request-checks)
  - [LGTM pull request checks](#lgtm-pull-request-checks)

There are numerous tools designed to monitor the "quality" (defined
in various ways) of your code and provide feedback on weak spots and
opportunities for improvement. We have a few of these configured to work
with your project repository, providing you with feedback in two forms:

* Badges (at the top of [README.md](README.md))
* Pull request checks

Unfortunately these badges and checks need to be (re)configured
every time you or GitHub Classroom makes a new repository. This is

* Every time GitHub Classroom creates a new repo from our starter code
* Every time a group forks or copies a repository from one iteration to another

Here's a checklist of actions you'll need to take for each
new repository:

* [ ] Fix Better Code Hub badge
* [ ] Fix LGTM badge(s)
* [ ] Enable PR checks for Better Code Hub
* [ ] Enable PR checks for LGTM

This document includes:

* Descriptions of the analysis tools we're currently using
* Info on how to configure the badges
* Info on how to enable the pull request checks

## What analysis tools are we using and why?

> Feel free to skip this and jump down to the sections on how to
> configure things if you wish. But you might want to come back to
> it, especially if you're unclear about what the feedback
> you're getting from these services means.

At the end of the day, nothing really replaces a quality code review
process. These help ensure that everyone on the team is on the same
page and knows what's happening with the project, and helps ensure that
the project is up to the team's standards. There are, however, things
that it's just easy to overlook, and things no one on the team is
actually aware of.

Code analysis tools can help make sure that at least a variety of
automatic checks happen on each pull request (PR). Then if a PR would
introduce a problem or in some other way "lower" the quality of the
code, everyone would know it and have a chance to address it before
that PR is merged in.

Badges also provide a nice visual indication of the health of the code
base. This can be useful for getting a quick sense of the state of the
project, as well as "advertising" that you care about quality and are
making an effort to maintain the quality of your codebase.

There are quite a few code analysis tools out there; we're using two
that, together, seem to cover a lot of the major issues in ways that
are pretty "user friendly": [Better Code Hub](https://bettercodehub.com/) and [LGTM](https://lgtm.com/). We make no
claims that these are the "best", however, and feel free to
explore others, sharing cool things that you discover.

Some other services:

* [CodeScene](https://codescene.io/) provides quite sophisticated analyses of your codebase,
  but it's not trivial to make sense of the huge amount of information
  that it provides.
* [Codacy](https://www.codacy.com/) is cool in that it understands a _lot_ of languages
  and notations, but it's defaults can be quite "noisy" and it's not
  trivial to reconfigure.

### Better Code Hub

[Better Code Hub](https://bettercodehub.com/) provides a "big picture" analysis of your codebase,
checking 10 particular properties. Many of these are different versions
of "keep things simple", although there are also architecture-level
checks. They have a check on testing that doesn't make any particular
sense to me; you should probably rely on your test coverages instead
of their "Automate Tests" check.

If you fail one of their checks, you can open up that check on their web
report page, and for most of them they'll point you directly at the
culprit(s). Even "passing" checks will often (when you open them) provide
you with "at risk" areas where you're approaching a potential problem.
You can also generate GitHub issues for your project directly from the
Better Code Hub report, if you want to bring a concern over from
Better Code Hub into your repo.

### LGTM ("Looks Good To Me")

[LGTM](https://lgtm.com/) provides a comprehensive set of "violations" based checks.
Where Better Code Hub is typically looking at the "big picture" state
of the codebase, LGTM is looking for specific (often line-level)
problems that have been shown to create potential issues for a
codebase.

It divides its alerts into _Errors_, _Warnings_ and _Recommendations_.
Errors should probably be taken quite seriously and addressed right away,
warnings should be addressed when feasible, and recommendations
are "good ideas" but not as pressing. LGTM orders alerts in a way
that attempts to put the most important alerts first, so when in doubt
just address them top down as time allows and necessity requires.

### What to do if you don't understand an alert?

It's not uncommon that you get an alert from an analysis tool that
you don't really understand, or you don't understand how to "fix".

Better Code Hub has a "Guideline Explanation" tab on the left of each
of the ten checks. (You have to open up that check to see the tab.)

Violation-based tools like LGTM will often provide a link to a
documentation source that provides more information, so you probably
want to start there. You might also search the Internet for more
information on that alert.

:warning: **When in doubt ASK!** Don't just decide to ignore an alert or
issue because you don't understand it. Ask your team, or the class,
or bring it up in class or office hours. BUT ASK! These can be a great
learning opportunity, but you have to ask for that to happen.

## Code quality badges

The badges are essentially just links to images that are generated
by the analysis service, which you can then include in things like
your README.md or other on-line documents.

Anytime a new repository is created, the badge
URLs will need to be updated. If they are not, then the badges
will reflect the state of the "parent" repository and not the
current repository. This isn't difficult, but it does need to be done
and should probably one of the very first "bookkeeping" tasks a team
does when setting up their repository.

### Updating the badges

Below are instructions for each of the different types of badges.

#### GitHub Actions build statuses

These badges do not need any changes. The URLs for those badges are
relative to your particular repository (that's what all the `../..` bits
do), so they "automagically" work when your repo is created.

Unfortunately the other badges are going from sources outside of GitHub,
so we can't use the same trick for them.

#### Better Code Hub and LGTM badges

When GitHub Classroom makes the initial copies of this repository, the
[Better Code Hub](https://bettercodehub.com) (BCH) and
[LGTM](https://lgtm.com) ("looks good to me") badges have several copies
of this string:

```text
UMM-CSci-3601/3601-lab4-mongo
```

This tells those services to include the badges for the `3601-lab4-mongo` repository in the `UMM-CSci-3601` organization. You need to update both the organization and the repository name so they match the "name" of your repository up
at the top of your repository page.

* The organization should be changed to whatever the GitHub
  organization is for this semester's course. This is probably
  something like `UMM-CSci-3601-S21`.
* The repository is whatever name you've given your repository,
  like `lab-4-stupendous-wombats`.

You then need to change all the instances of

```text
UMM-CSci-3601/3601-iteration-template
```

so they match the name of your repository, e.g.,

```text
UMM-CSci-3601-S21/it-1-stupendous-wombats
```

Once all those are updated, then the badges should point to the
correct analysis and reflect the state of _your_ project. These don't
always update immediately because of browser caching, but if you click
on the badges that should take you to pages on that analysis service that
reflect _your_ project.

## Enabling pull request checks

Each time a new repository is created, you will also need to make
sure that these analysis services are running checks
whenever you do pull requests. You want to make sure that you're getting
automated checks on every pull request so that you can avoid merging
in checks that would in some way harm the quality of the codebase.

Below are instructions for enabling pull request checks from
the external services.

### Better Code Hub pull request checks

:warning: :exclamation: :warning: You _must_ enable this or
**you won't be able to ever merge
into `main`**. As part of the branch protection setup, you have to
"pass" Better Code Hub's checks, which can't happen if you don't have
the checks enabled.

To enable pull request checks from Better Code Hub you need to:

1. Go to [Better Code Hub](https://bettercodehub.com) and login using
   your GitHub account.
2. Choose this semester's organization icon from the set of icons to the
   right of "Your repositories".
3. That should display all the repositories for this semester, which may
   be rather a lot. Scroll or search to find your
   specific repository.
4. On the bottom left of your repo's card should be the GitHub pull
   request icon. Click that to enable Better Code Hub pull request checks
   for that repository.

You should then see Better Code Hub checks on your next pull request on
that project.

### LGTM pull request checks

LGTM should start doing pull request checks automatically.

By default, LGTM injects comments into the code review whenever a
pull request
will either increase or decrease the number of alerts. If your team
(it should be a group decision) finds those annoying, [you can disable
them](https://lgtm.com/help/lgtm/managing-automated-code-review#pr-comments).
