# Production Review Process

## Overview

This document establishes the production review process for making evidence-based roadmap decisions after 2-4 weeks of real usage. The goal is to review comprehensive evidence before deciding what to build next, ensuring that product decisions are driven by actual user behavior and feedback rather than assumptions.

---

## 1. Review Inputs

### Analytics Metrics

**Daily Active Users (DAU)**
- Count of unique users active each day
- Track trends over time
- Identify peaks and troughs in usage patterns

**Weekly Active Users (WAU)**
- Count of unique users active each week
- Measure user retention and engagement
- Calculate DAU/WAU ratio for stickiness assessment

**Note Creation Volume**
- Number of notes created per day/week
- Growth rate of note creation
- Average notes per user
- Distribution of note creation across user segments

**AI Usage Volume**
- Number of AI-powered features used
- Frequency of AI summary generation
- AI feature adoption rate
- AI usage by user type

**Search Usage**
- Number of search queries performed
- Search success rate (queries returning results)
- Average search latency
- Popular search terms and patterns

**Feedback Submissions**
- Number of feedback submissions
- Feedback sentiment analysis (positive/negative/neutral)
- Feedback categories (bug reports, feature requests, general feedback)
- Response time to feedback

### Bug Tracking

**Open Bugs**
- Total count of currently open bugs
- Bug severity distribution (Critical/High/Medium/Low)
- Average time bugs remain open
- Bugs by component/feature

**Fixed Bugs**
- Number of bugs resolved in review period
- Average resolution time
- Fix success rate (percentage of fixes that actually resolve the issue)
- Recurrence rate (fixed bugs that reappear)

**Critical Bugs**
- Count of Critical severity bugs
- Critical bugs currently open
- Critical bugs fixed in period
- Time to resolve Critical bugs (target: <24 hours)

**Most Frequent Bugs**
- Top 5 most commonly reported bugs
- Bugs affecting the most users
- Bugs with highest recurrence rate
- Bugs causing the most support requests

### Feature Requests

**Request Count**
- Total number of feature requests received
- New requests vs. existing requests
- Requests by category/feature area

**Request Frequency**
- Distribution by frequency: Rare (1 user), Occasional (2-3 users), Frequent (4+ users)
- Requests with increasing frequency
- Requests with decreasing frequency

**User Types Requesting Features**
- Breakdown by user type (Student/Developer/Professional/Other)
- Features requested by multiple user types
- User type specific requests

### Support Requests

**User Questions**
- Total number of support questions
- Common question categories
- Questions with highest volume
- Questions that could be addressed with documentation/UX improvements

**User Confusion Areas**
- Features or workflows users frequently ask about
- UI/UX elements causing confusion
- Onboarding pain points
- Areas where users get stuck

**Repeated Problems**
- Support requests that recur frequently
- Problems affecting multiple users
- Issues that generate the most follow-up questions
- Patterns in repeated problems

### Performance Metrics

**API Response Times**
- Average response time for each API endpoint
- P95 and P99 latency percentiles
- Response time trends over time
- Slowest endpoints

**Error Rates**
- Overall API error rate
- Error rate by endpoint
- Error rate trends
- Most common error types (4xx vs 5xx)
- Error rate by client/browser

**Search Performance**
- Average search response time
- Search success rate
- Search result quality metrics
- Search index update latency

**AI Summary Performance**
- Average time to generate AI summaries
- AI summary success rate
- AI summary quality ratings (if available)
- AI model latency and errors

---

## 2. Review Questions

### Usage Questions

**Which features are used most?**
- Rank features by usage volume
- Identify top 5 most used features
- Calculate percentage of total usage for each feature
- Compare with previous periods to identify trends

**Which features are rarely used?**
- Identify features with usage below threshold (e.g., <5% of users)
- Features with declining usage
- Features with consistently low adoption
- Features that users try once but don't return to

**What is the activation rate?**
- Percentage of new users who use core features within first session
- Percentage who use core features within first week
- Activation rate trends over time
- Activation rate by user type

**What is the return rate?**
- Percentage of users who return within 7 days
- Percentage who return within 30 days
- Return rate trends
- Return rate by cohort (sign-up date)

### Quality Questions

**What bugs occur most often?**
- Top 5 bugs by report count
- Top 5 bugs by affected users
- Bugs with highest impact on user experience
- Bugs that cause the most support requests

**What support requests repeat?**
- Top 5 most frequent support request categories
- Support requests with highest volume
- Support requests that could be prevented
- Support requests indicating UX issues

### Performance Questions

**What pages are slow?**
- Pages with longest load times
- Pages with highest latency percentiles
- Pages where performance degraded in review period
- Pages with most user complaints about speed

**What APIs fail most?**
- API endpoints with highest error rates
- Endpoints with most 5xx errors
- Endpoints with most 4xx errors
- Endpoints with increasing error rates

### Feature Questions

**Which feature requests appear most frequently?**
- Top 5 feature requests by count
- Feature requests with highest frequency rating
- Feature requests from multiple user types
- Feature requests with increasing momentum

**Which requests come from multiple user types?**
- Feature requests from 2+ different user types
- Feature requests that address needs across user segments
- Cross-user-type alignment in feature priorities

---

## 3. Decision Framework

### Priority System

**Priority 1: Fix Critical Bugs**
- Criteria: Bugs marked as Critical severity
- Impact: Potential data loss, security vulnerabilities, complete feature breakdown
- Target Resolution: Within 24 hours
- Examples: Authentication failures, data corruption, payment processing issues

**Priority 2: Fix Reliability Issues**
- Criteria: High-severity bugs, recurring errors, stability problems
- Impact: Significant user frustration, feature unusability, high support volume
- Target Resolution: Within 1 week
- Examples: Frequent API failures, search not working, AI features timing out

**Priority 3: Improve Most Used Features**
- Criteria: Features in top 20% of usage, high engagement
- Impact: Improvements benefit large user base, increase retention
- Target: Continuous improvement, quarterly major updates
- Examples: Enhancing note creation, improving search, optimizing AI features

**Priority 4: Build Frequently Requested Features**
- Criteria: Feature requests with Frequency = Frequent (4+ users), multiple user types
- Impact: Addresses clear user demand, improves satisfaction
- Target: Bi-weekly review, monthly implementation planning
- Examples: Features requested by 4+ users from different user types

**Priority 5: Everything Else**
- Criteria: All other requests, low-usage features, rare bug fixes
- Impact: Nice-to-have improvements, edge case fixes
- Target: Consider during slower periods, lower priority
- Examples: Minor UI tweaks, rarely used feature improvements, low-priority bugs

### Decision Matrix

| Factor | Priority 1 | Priority 2 | Priority 3 | Priority 4 | Priority 5 |
|--------|------------|------------|------------|------------|------------|
| Critical Bugs | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reliability Issues | ❌ | ✅ | ❌ | ❌ | ❌ |
| Most Used Features | ❌ | ❌ | ✅ | ❌ | ❌ |
| Frequent Requests | ❌ | ❌ | ❌ | ✅ | ❌ |
| Other | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Feature Approval Rules

### Approval Criteria

A feature **may be approved** when **ALL** of the following conditions are met:

1. **Requested by multiple users**
   - Minimum of 4+ users requesting the same feature
   - OR 2-3 users from different user types

2. **Requested by multiple user types**
   - Feature requested by users from at least 2 different user types
   - Indicates broad appeal beyond a single user segment

3. **Supports product vision**
   - Aligns with the overall product strategy and roadmap
   - Contributes to core value proposition
   - Does not conflict with existing product direction

4. **Does not significantly increase complexity**
   - Implementation effort is reasonable (estimated <2 weeks)
   - Maintenance burden is manageable
   - Does not introduce significant technical debt
   - Does not require major architectural changes

### Rejection Criteria

A feature **should be rejected** if:

- Requested by only one user (regardless of other factors)
- Does not align with product vision
- Would require significant complexity increase
- Has low potential user impact
- Already exists in the product (user unaware)
- Can be addressed through documentation or support

### Deferral Criteria

A feature **should be deferred** if:

- Meets some but not all approval criteria
- Currently lower priority than other approved features
- Requires more user validation/feedback
- Depends on other features or infrastructure
- Resource constraints prevent immediate implementation

---

## 5. Review Cadence

### Weekly Reviews

**Focus Areas:**
- Bugs (new, fixed, critical)
- Reliability issues
- Performance metrics

**Participants:**
- Engineering Lead
- Product Manager
- Support Lead

**Duration:** 30-60 minutes

**Output:**
- Bug triage and prioritization
- Reliability improvements identified
- Performance optimization tasks
- Critical issues escalation

### Bi-Weekly Reviews

**Focus Areas:**
- Feature requests (new, trending, frequently requested)
- Analytics trends (usage patterns, growth metrics)
- User feedback themes

**Participants:**
- Product Manager
- Engineering Team
- Design Lead (optional)
- Support Team

**Duration:** 60-90 minutes

**Output:**
- Feature request prioritization
- Usage trend analysis
- Feedback-driven improvements
- Feature approval/deferral/rejection decisions

### Monthly Reviews

**Focus Areas:**
- Product direction review
- Roadmap validation
- Strategic alignment
- Long-term planning

**Participants:**
- Product Manager
- Engineering Lead
- Business Stakeholders
- Design Lead

**Duration:** 90-120 minutes

**Output:**
- Roadmap updates
- Strategic decisions
- Resource allocation
- Long-term feature planning

---

## 6. Review Output Template

Use this template to document the results of each production review period.

```markdown
## Production Review Period: YYYY-MM-DD → YYYY-MM-DD

### Review Team
- Facilitator: [Name]
- Participants: [Name1], [Name2], [Name3]
- Date: YYYY-MM-DD

---

### Analytics

**Daily Active Users (DAU):**
- Average: [number]
- Peak: [number] (on YYYY-MM-DD)
- Trend: [↑/↓/→] [X%] from previous period

**Weekly Active Users (WAU):**
- Total: [number]
- Trend: [↑/↓/→] [X%] from previous period

**Notes Created:**
- Total: [number]
- Average per user: [number]
- Trend: [↑/↓/→] [X%]

**AI Usage:**
- Total AI feature uses: [number]
- AI summary generations: [number]
- Trend: [↑/↓/→] [X%]

**Search Usage:**
- Total searches: [number]
- Search success rate: [X]%
- Average search time: [X]ms

**Feedback Submissions:**
- Total: [number]
- Bug reports: [number]
- Feature requests: [number]
- General feedback: [number]

---

### Bugs

**Open:**
- Total: [number]
- By Severity:
  - Critical: [number]
  - High: [number]
  - Medium: [number]
  - Low: [number]

**Critical:**
- Currently open: [number]
- Fixed this period: [number]

**Fixed:**
- Total: [number]
- Average resolution time: [X] days

**Most Frequent Bugs:**
1. [Bug Title] - [Count] reports, [Severity]
2. [Bug Title] - [Count] reports, [Severity]
3. [Bug Title] - [Count] reports, [Severity]

---

### Feature Requests

**Total Requests:**
- New: [number]
- Existing: [number]
- Total: [number]

**Top Requests:**
1. **[Feature Name]**
   - Request Count: [number]
   - Frequency: [Rare/Occasional/Frequent]
   - User Types: [List types]
   - Priority: [Low/Medium/High]

2. **[Feature Name]**
   - Request Count: [number]
   - Frequency: [Rare/Occasional/Frequent]
   - User Types: [List types]
   - Priority: [Low/Medium/High]

3. **[Feature Name]**
   - Request Count: [number]
   - Frequency: [Rare/Occasional/Frequent]
   - User Types: [List types]
   - Priority: [Low/Medium/High]

---
### Support Requests

**User Questions:**
- Total: [number]
- Most Common:
  1. [Question] - [Count]
  2. [Question] - [Count]
  3. [Question] - [Count]

**User Confusion Areas:**
1. [Area] - [Description]
2. [Area] - [Description]
3. [Area] - [Description]

**Repeated Problems:**
1. [Problem] - [Count]
2. [Problem] - [Count]
3. [Problem] - [Count]

---
### Performance

**API Response Times:**
- Average: [X]ms
- P95: [X]ms
- P99: [X]ms
- Slowest Endpoint: [Name] - [X]ms

**Error Rates:**
- Overall: [X]%
- By Endpoint:
  - [Endpoint]: [X]%
  - [Endpoint]: [X]%

**Search Performance:**
- Average response time: [X]ms
- Success rate: [X]%

**AI Summary Performance:**
- Average generation time: [X]ms
- Success rate: [X]%

---
### Decisions

**Approved:**
1. [Feature/Improvement] - [Brief Justification]
2. [Feature/Improvement] - [Brief Justification]
3. [Feature/Improvement] - [Brief Justification]

**Deferred:**
1. [Feature/Improvement] - [Reason for Deferral]
2. [Feature/Improvement] - [Reason for Deferral]

**Rejected:**
1. [Feature/Improvement] - [Reason for Rejection]
2. [Feature/Improvement] - [Reason for Rejection]

---
### Next Sprint Priorities

1. **[Priority 1: Critical Bug Fix]** - [Description] - [Owner] - [Due Date]
2. **[Priority 2: Reliability Improvement]** - [Description] - [Owner] - [Due Date]
3. **[Priority 3: Feature Enhancement]** - [Description] - [Owner] - [Due Date]

---
### Action Items

- [ ] [Action] - [Owner] - [Due Date]
- [ ] [Action] - [Owner] - [Due Date]
- [ ] [Action] - [Owner] - [Due Date]

---
### Notes

[Any additional observations, insights, or context not captured above]
```

---

## 7. Success Criteria

✅ **Roadmap decisions are based on evidence from real users rather than assumptions**

**Measurement:**
- All approved features have supporting data (usage metrics, request counts, user feedback)
- Decision documentation includes references to specific metrics and evidence
- No features are approved based solely on individual opinions or anecdotal feedback

**Validation:**
- Review each approved feature to confirm it meets approval criteria
- Verify that rejection and deferral decisions are justified with data
- Ensure priority assignments align with the decision framework

---

## 8. Process Guidelines

### Preparation

1. **Data Collection**
   - Gather all metrics from the review period
   - Compile bug reports, feature requests, support tickets
   - Prepare performance data and analytics
   - Create summary dashboards if available

2. **Pre-Review Analysis**
   - Identify trends and patterns
   - Highlight significant changes from previous periods
   - Flag critical issues requiring immediate attention
   - Prepare preliminary recommendations

3. **Documentation**
   - Complete the Review Output Template with all available data
   - Note any data gaps or quality issues
   - Document questions for discussion

### During Review

1. **Data Presentation**
   - Present key metrics and trends
   - Highlight critical issues
   - Show comparison with previous periods

2. **Discussion**
   - Review each section of the template
   - Discuss insights and observations
   - Debate approval/deferral/rejection decisions
   - Validate against decision framework

3. **Decision Making**
   - Apply priority framework to each item
   - Make approval decisions based on criteria
   - Assign owners and timelines for approved items
   - Document rationale for all decisions

### Post-Review

1. **Documentation**
   - Finalize the Review Output Template
   - Update feature request tracking
   - Update bug tracking with new priorities
   - Communicate decisions to stakeholders

2. **Communication**
   - Share review results with the team
   - Update users on critical bug fixes
   - Communicate feature approvals/deferrals to requesters
   - Update roadmap and product documentation

3. **Follow-up**
   - Track progress on approved items
   - Monitor impact of implemented changes
   - Prepare for next review cycle
   - Address any action items from current review

---
## 9. Tools and Resources

- **Analytics Dashboard:** [Link to METRICS_DASHBOARD.md]
- **Feature Request Tracking:** [Link to FEATURE_REQUESTS.md]
- **Bug Tracking:** [Link to BUGS.md]
- **Deployment Runbook:** [Link to DEPLOYMENT_RUNBOOK.md]

---
## 10. Appendix

### Glossary

- **DAU:** Daily Active Users - Unique users active in a single day
- **WAU:** Weekly Active Users - Unique users active in a 7-day period
- **P95/P99:** 95th and 99th percentile - Indicates the value below which 95%/99% of observations fall
- **Activation Rate:** Percentage of new users who complete a key action (e.g., create first note)
- **Return Rate:** Percentage of users who come back within a specific time period

### References

- [FEATURE_REQUESTS.md](../FEATURE_REQUESTS.md) - Feature request management process
- [BUGS.md](../BUGS.md) - Bug tracking and management
- [METRICS_DASHBOARD.md](../METRICS_DASHBOARD.md) - Analytics and metrics tracking
- [ROADMAP.md](../ROADMAP.md) - Product roadmap and vision

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | [Author] | Initial creation |