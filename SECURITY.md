# Security Policy

## What is considered a vulnerability?

There are some types of [low-severity][severity] vulnerabilities that we will not acknowledge as CVE and treat as bugs instead.
All vulnerabilities with a severity of medium and above will of course be acknowledged and fixed.

Please see the below section on how we treat [ReDoS] vulnerabilities.

If you are unsure whether a vulnerability you found qualifies, please report it as a vulnerability via email (see below).

### ReDoS

Prism is a regex-based syntax highlighter.
As such, the main types of vulnerabilities reported to us are [ReDoS] vulnerabilities ([CWE-1333](https://cwe.mitre.org/data/definitions/1333.html)), aka slow regexes.

However, not all ReDoS is created equal.
A slow regex can be have a [worst-case time complexity](https://en.wikipedia.org/wiki/Time_complexity) anywhere from _O(n<sup>2</sup>)_ to _2<sup>O(n)</sup>_.
This matters because a worst-case time complexity _≥ O(n<sup>3</sup>)_ is a [high severity][severity] vulnerability while _O(n<sup>2</sup>)_ is low or medium severity in the context of Prism.
Furthermore, worst-case time complexities of _O(n<sup>2</sup>)_ can have 2 different causes: backtracking or moving.
Backtracking is always fixable by rewriting the slow regex but moving is not (except in special cases).

Because of their lower severity and the fact that moving is difficult or impossible to fix, we will treat regexes with worst-case time complexity of _O(n<sup>2</sup>)_ caused by moving as regular bugs and not as vulnerabilities.
Please report them as [bugs](https://github.com/PrismJS/prism/issues/new/choose) instead of as vulnerabilities.

If you found a slow regex but are unsure about the worst-case time complexity or its cause, please report it as a vulnerability via email (see below).


## Reporting a Vulnerability

***DO NOT CREATE AN ISSUE*** to report a vulnerability.

Instead, please send an email to at least one of [Prism's maintainers](MAINTAINERS.md).
See [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) for more details.

### Procedure

1.  After you send an email [a maintainer](MAINTAINERS.md), you should receive a response from the [Prism team](https://github.com/orgs/PrismJS/people) within 3 days.

    We may require further information, so please keep in touch with us until the vulnerability has been fixed.

2.  After the vulnerability has been confirmed and accepted, we will create a [security advisory](https://docs.github.com/en/code-security/security-advisories/about-github-security-advisories) and start working on a fix.

    You will be [added as a collaborator](https://docs.github.com/en/code-security/security-advisories/adding-a-collaborator-to-a-security-advisory) (this requires a GitHub account).
    At this point, all communication will occur using comments on the advisory and the [temporary private fork](https://docs.github.com/en/code-security/security-advisories/collaborating-in-a-temporary-private-fork-to-resolve-a-security-vulnerability).

3.  After the fix has been merged, we will make a new release and publish the security advisory within one week.


[ReDoS]: https://en.wikipedia.org/wiki/ReDoS
[severity]: https://www.imperva.com/learn/application-security/cve-cvss-vulnerability/
