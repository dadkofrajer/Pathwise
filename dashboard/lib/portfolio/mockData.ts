import { PortfolioAnalysis } from './types';

// Mock data matching the structure from examples/sample_output.json
export const mockPortfolioAnalysis: PortfolioAnalysis = {
  scores: {
    lens_scores: {
      Curiosity: 3.91,
      Growth: 0.62,
      Community: 10,
      Creativity: 5.41,
      Leadership: 6.71,
      Achievements: 0
    }
  },
  critical_improvements: [
    {
      gap_type: "lens",
      gap_description: "Achievements lens is 0.0/10 (target: ≥4.0)",
      severity: 1,
      tasks: [
        {
          title: "Participate in a National Coding Competition",
          track: "US",
          estimated_hours: 20,
          definition_of_done: [
            "Register for the competition",
            "Complete the coding challenge",
            "Submit the project before the deadline"
          ],
          micro_coaching: "Focus on showcasing innovative solutions in your project to enhance your achievements lens.",
          quick_links: [
            "https://www.hackerrank.com/competitions",
            "https://www.codeforces.com/contests"
          ]
        },
        {
          title: "Apply for a Technology Innovation Award",
          track: "US",
          estimated_hours: 15,
          definition_of_done: [
            "Research relevant awards in technology",
            "Prepare a project submission highlighting your Mobile App for Local Food Bank",
            "Submit the application before the deadline"
          ],
          micro_coaching: "Emphasize the social impact of your project to strengthen your application.",
          quick_links: [
            "https://www.innovationawards.com",
            "https://www.techawards.org"
          ]
        },
        {
          title: "Create a Portfolio Website",
          track: "US",
          estimated_hours: 10,
          definition_of_done: [
            "Choose a platform (e.g., GitHub Pages, WordPress)",
            "Include sections for your projects, achievements, and contact information",
            "Launch the website and share it with peers"
          ],
          micro_coaching: "Highlight your achievements and projects to create a strong first impression.",
          quick_links: [
            "https://pages.github.com/",
            "https://wordpress.com/"
          ]
        }
      ]
    },
    {
      gap_type: "lens",
      gap_description: "Growth lens is 0.62/10 (target: ≥4.0)",
      severity: 0.84,
      tasks: [
        {
          title: "Enroll in an Online Course on AI Ethics",
          track: "US",
          estimated_hours: 30,
          definition_of_done: [
            "Select a course (e.g., Coursera, edX)",
            "Complete all modules and assignments",
            "Obtain a certificate upon completion"
          ],
          micro_coaching: "This will deepen your understanding of AI ethics and enhance your research assistant role.",
          quick_links: [
            "https://www.coursera.org",
            "https://www.edx.org"
          ]
        },
        {
          title: "Join a Language Exchange Program",
          track: "US",
          estimated_hours: 12,
          definition_of_done: [
            "Find a partner for Spanish language exchange",
            "Schedule weekly sessions for conversation practice",
            "Document your progress and experiences"
          ],
          micro_coaching: "Improving your language skills will contribute to personal growth and cultural understanding.",
          quick_links: [
            "https://www.conversationexchange.com",
            "https://www.tandem.net"
          ]
        },
        {
          title: "Attend a Personal Development Workshop",
          track: "US",
          estimated_hours: 8,
          definition_of_done: [
            "Research and select a relevant workshop",
            "Participate actively in the sessions",
            "Reflect on what you've learned and how to apply it"
          ],
          micro_coaching: "Focus on workshops that enhance skills relevant to your major and personal interests.",
          quick_links: [
            "https://www.eventbrite.com",
            "https://www.meetup.com"
          ]
        }
      ]
    },
    {
      gap_type: "lens",
      gap_description: "Curiosity lens is 3.91/10 (target: ≥4.0)",
      severity: 0.02,
      tasks: [
        {
          title: "Start a Blog on AI and Climate Science",
          track: "US",
          estimated_hours: 15,
          definition_of_done: [
            "Choose a blogging platform",
            "Write and publish at least three posts on your Machine Learning Wildfire Prediction System",
            "Promote your blog on social media"
          ],
          micro_coaching: "This will showcase your curiosity and knowledge in AI and climate science.",
          quick_links: [
            "https://medium.com",
            "https://wordpress.com"
          ]
        },
        {
          title: "Conduct an Independent Research Project",
          track: "US",
          estimated_hours: 40,
          definition_of_done: [
            "Identify a research question related to AI ethics",
            "Gather data and analyze findings",
            "Write a report and present your research"
          ],
          micro_coaching: "This will enhance your research skills and curiosity in the field.",
          quick_links: [
            "https://www.researchgate.net",
            "https://www.academia.edu"
          ]
        },
        {
          title: "Attend a Tech Conference",
          track: "US",
          estimated_hours: 10,
          definition_of_done: [
            "Register for a relevant conference",
            "Network with professionals and attend workshops",
            "Summarize key takeaways and share them with peers"
          ],
          micro_coaching: "Engaging with industry leaders will fuel your curiosity and provide insights into future trends.",
          quick_links: [
            "https://www.techmeme.com/events",
            "https://www.eventbrite.com"
          ]
        }
      ]
    }
  ]
};

