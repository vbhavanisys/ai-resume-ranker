import { AnalysisRecord } from '../types';

export const initialAnalysisRecords: AnalysisRecord[] = [
  {
    id: 'ana-101',
    candidateName: 'Alex Developer',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'TechCorp',
    matchScore: 85,
    date: 'Oct 24, 2024',
    fileType: 'pdf',
    fileName: 'Senior_Frontend_Eng_Alex.pdf',
    status: 'High Match',
    matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Jest'],
    missingSkills: ['Docker', 'AWS', 'CI/CD'],
    suggestions: [
      {
        title: 'Quantify Achievements',
        description: "Your bullet points under 'Senior Developer' list responsibilities rather than outcomes. E.g., Change 'Improved performance' to 'Improved load time by 40% resulting in higher conversion.'",
        icon: 'edit_document'
      },
      {
        title: 'Optimize Summary Section',
        description: "The professional summary is generic. Include specific keywords mentioned in the job description like 'scalable architecture' and 'mentorship'.",
        icon: 'title'
      },
      {
        title: 'Highlight Cloud & DevOps Skills',
        description: 'The job description requires basic Docker containerization and AWS deployment experience. Consider mentioning personal projects or certifications in these areas.',
        icon: 'cloud'
      }
    ],
    originalBullet: 'Managed a team to build a web application.',
    optimizedBullet: 'Spearheaded an Agile team of 5 to architect a scalable React web application, improving load times by 30%.'
  },
  {
    id: 'ana-102',
    candidateName: 'Sarah Jenkins',
    jobTitle: 'Product Manager',
    companyName: 'Startup Inc',
    matchScore: 74,
    date: 'Yesterday',
    fileType: 'docx',
    fileName: 'J_Doe_Resume_V2.docx',
    status: 'Moderate Match',
    matchedSkills: ['Agile / Scrum', 'User Stories', 'Roadmapping', 'Jira', 'SQL'],
    missingSkills: ['A/B Testing', 'Product Analytics', 'Mixpanel'],
    suggestions: [
      {
        title: 'Add Product Metrics',
        description: 'Include metric improvements like DAU growth, retention uplift, or churn reduction in your experience section.',
        icon: 'analytics'
      },
      {
        title: 'Incorporate Product Tools',
        description: 'Mention specific analytical tools such as Amplitude, Mixpanel, or Google Analytics.',
        icon: 'build'
      }
    ]
  },
  {
    id: 'ana-103',
    candidateName: 'David Chen',
    jobTitle: 'Backend Software Engineer',
    companyName: 'Acme Corp',
    matchScore: 92,
    date: '2 hrs ago',
    fileType: 'pdf',
    fileName: 'Senior_Backend_Eng.pdf',
    status: 'High Match',
    matchedSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Kafka', 'Docker', 'Kubernetes'],
    missingSkills: ['Redis', 'gRPC'],
    suggestions: [
      {
        title: 'Emphasize High Concurrency',
        description: 'Elaborate on peak requests per second (RPS) handled by microservices at Acme Corp.',
        icon: 'speed'
      }
    ]
  },
  {
    id: 'ana-104',
    candidateName: 'Priya Sharma',
    jobTitle: 'UI/UX Designer',
    companyName: 'Design Studio',
    matchScore: 68,
    date: 'Oct 18, 2024',
    fileType: 'pdf',
    fileName: 'Priya_Design_Resume.pdf',
    status: 'Low Match',
    matchedSkills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'],
    missingSkills: ['Design Systems', 'HTML/CSS', 'Usability Testing'],
    suggestions: [
      {
        title: 'Include Design System Case Studies',
        description: 'Provide examples of creating tokenized Figma libraries and handoffs for engineering teams.',
        icon: 'style'
      }
    ]
  }
];
