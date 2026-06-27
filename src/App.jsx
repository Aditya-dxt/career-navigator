import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Upload, FileText, ChevronRight, Sparkles, Brain, Target,
  BookOpen, Download, ArrowLeft, CheckCircle2, Clock,
  Code2, Cloud, BarChart3, Layout, Server,
  Zap, Star, Users, ExternalLink, Copy, Check, Rocket,
  GraduationCap, Wrench, TrendingUp,
  X, AlertTriangle, CircleDot, ClipboardList,
  Wifi, WifiOff, Type
} from 'lucide-react';
import './index.css';

/* ═══════════════════════════════════════════════════════════════════
   GEMINI API CONFIG
   ═══════════════════════════════════════════════════════════════════ */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/* ═══════════════════════════════════════════════════════════════════
   PDF TEXT EXTRACTION
   ═══════════════════════════════════════════════════════════════════ */
async function extractResumeText(file) {
  if (!file) return '';
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
      }
      return fullText.trim();
    } catch (err) {
      console.error('PDF extraction error:', err);
      throw new Error('Could not extract text from PDF.');
    }
  }
  return `Resume file: ${file.name}`;
}

/* ═══════════════════════════════════════════════════════════════════
   COMPREHENSIVE SKILL DATABASE
   Each skill has: name, aliases (for matching), category
   ═══════════════════════════════════════════════════════════════════ */
const SKILL_DB = [
  // ── Languages ──
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'es2015', 'ecmascript', 'es6+', 'es2020'], cat: 'lang' },
  { name: 'TypeScript', aliases: ['typescript', 'ts'], cat: 'lang' },
  { name: 'Python', aliases: ['python', 'python3', 'py'], cat: 'lang' },
  { name: 'Java', aliases: ['java', 'j2ee', 'jvm'], cat: 'lang' },
  { name: 'C++', aliases: ['c++', 'cpp', 'c plus plus'], cat: 'lang' },
  { name: 'C#', aliases: ['c#', 'csharp', 'c sharp', '.net', 'dotnet'], cat: 'lang' },
  { name: 'Go', aliases: ['go', 'golang'], cat: 'lang' },
  { name: 'Rust', aliases: ['rust', 'rustlang'], cat: 'lang' },
  { name: 'Ruby', aliases: ['ruby'], cat: 'lang' },
  { name: 'PHP', aliases: ['php', 'laravel'], cat: 'lang' },
  { name: 'Swift', aliases: ['swift', 'swiftui'], cat: 'lang' },
  { name: 'Kotlin', aliases: ['kotlin'], cat: 'lang' },
  { name: 'Scala', aliases: ['scala'], cat: 'lang' },
  { name: 'R', aliases: ['\\br\\b', 'r programming', 'r language', 'rstudio'], cat: 'lang' },
  { name: 'SQL', aliases: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'plsql', 'tsql'], cat: 'lang' },
  { name: 'HTML', aliases: ['html', 'html5'], cat: 'lang' },
  { name: 'CSS', aliases: ['css', 'css3', 'scss', 'sass', 'less', 'stylesheets'], cat: 'lang' },
  { name: 'Shell/Bash', aliases: ['bash', 'shell', 'zsh', 'shell scripting', 'sh'], cat: 'lang' },
  // ── Frontend ──
  { name: 'React', aliases: ['react', 'reactjs', 'react.js', 'react js'], cat: 'frontend' },
  { name: 'Angular', aliases: ['angular', 'angularjs', 'angular.js'], cat: 'frontend' },
  { name: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js', 'vue js', 'nuxt'], cat: 'frontend' },
  { name: 'Next.js', aliases: ['next', 'nextjs', 'next.js', 'next js'], cat: 'frontend' },
  { name: 'Svelte', aliases: ['svelte', 'sveltekit'], cat: 'frontend' },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], cat: 'frontend' },
  { name: 'Bootstrap', aliases: ['bootstrap'], cat: 'frontend' },
  { name: 'Material UI', aliases: ['material ui', 'mui', 'material-ui', 'material design'], cat: 'frontend' },
  { name: 'jQuery', aliases: ['jquery'], cat: 'frontend' },
  { name: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'], cat: 'frontend' },
  { name: 'Webpack', aliases: ['webpack'], cat: 'frontend' },
  { name: 'Vite', aliases: ['vite', 'vitejs'], cat: 'frontend' },
  { name: 'Framer Motion', aliases: ['framer motion', 'framer'], cat: 'frontend' },
  { name: 'Responsive Design', aliases: ['responsive', 'responsive design', 'mobile-first', 'media queries'], cat: 'frontend' },
  // ── Backend ──
  { name: 'Node.js', aliases: ['node', 'nodejs', 'node.js', 'node js'], cat: 'backend' },
  { name: 'Express', aliases: ['express', 'expressjs', 'express.js'], cat: 'backend' },
  { name: 'Django', aliases: ['django'], cat: 'backend' },
  { name: 'Flask', aliases: ['flask'], cat: 'backend' },
  { name: 'FastAPI', aliases: ['fastapi', 'fast api'], cat: 'backend' },
  { name: 'Spring Boot', aliases: ['spring', 'spring boot', 'springboot'], cat: 'backend' },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js', 'nest js'], cat: 'backend' },
  { name: 'Ruby on Rails', aliases: ['rails', 'ruby on rails', 'ror'], cat: 'backend' },
  { name: 'ASP.NET', aliases: ['asp.net', 'asp net', 'aspnet'], cat: 'backend' },
  { name: 'GraphQL', aliases: ['graphql', 'graph ql', 'apollo'], cat: 'backend' },
  { name: 'REST APIs', aliases: ['rest', 'restful', 'rest api', 'rest apis', 'api development', 'api design'], cat: 'backend' },
  { name: 'gRPC', aliases: ['grpc', 'protobuf', 'protocol buffers'], cat: 'backend' },
  { name: 'WebSockets', aliases: ['websocket', 'websockets', 'socket.io', 'socket io', 'real-time'], cat: 'backend' },
  // ── Databases ──
  { name: 'MongoDB', aliases: ['mongodb', 'mongo', 'mongoose'], cat: 'database' },
  { name: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'], cat: 'database' },
  { name: 'MySQL', aliases: ['mysql'], cat: 'database' },
  { name: 'Redis', aliases: ['redis'], cat: 'database' },
  { name: 'Firebase', aliases: ['firebase', 'firestore'], cat: 'database' },
  { name: 'Supabase', aliases: ['supabase'], cat: 'database' },
  { name: 'DynamoDB', aliases: ['dynamodb', 'dynamo'], cat: 'database' },
  { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic', 'elk'], cat: 'database' },
  { name: 'Cassandra', aliases: ['cassandra'], cat: 'database' },
  { name: 'Prisma', aliases: ['prisma', 'prisma orm'], cat: 'database' },
  // ── Cloud & DevOps ──
  { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'sqs', 'sns', 'cloudformation'], cat: 'cloud' },
  { name: 'Azure', aliases: ['azure', 'microsoft azure'], cat: 'cloud' },
  { name: 'GCP', aliases: ['gcp', 'google cloud', 'google cloud platform', 'bigquery'], cat: 'cloud' },
  { name: 'Docker', aliases: ['docker', 'dockerfile', 'docker-compose', 'containerization', 'containers'], cat: 'devops' },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'kubectl', 'helm'], cat: 'devops' },
  { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'], cat: 'devops' },
  { name: 'Ansible', aliases: ['ansible'], cat: 'devops' },
  { name: 'Jenkins', aliases: ['jenkins'], cat: 'devops' },
  { name: 'GitHub Actions', aliases: ['github actions', 'github ci', 'gh actions'], cat: 'devops' },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'ci cd', 'continuous integration', 'continuous deployment', 'continuous delivery'], cat: 'devops' },
  { name: 'Nginx', aliases: ['nginx', 'reverse proxy'], cat: 'devops' },
  { name: 'Linux', aliases: ['linux', 'ubuntu', 'centos', 'debian', 'unix'], cat: 'devops' },
  { name: 'Prometheus', aliases: ['prometheus'], cat: 'devops' },
  { name: 'Grafana', aliases: ['grafana'], cat: 'devops' },
  { name: 'ArgoCD', aliases: ['argocd', 'argo cd', 'gitops'], cat: 'devops' },
  // ── AI / ML ──
  { name: 'TensorFlow', aliases: ['tensorflow', 'tf', 'keras'], cat: 'ml' },
  { name: 'PyTorch', aliases: ['pytorch', 'torch'], cat: 'ml' },
  { name: 'Scikit-learn', aliases: ['scikit-learn', 'sklearn', 'scikit learn'], cat: 'ml' },
  { name: 'Pandas', aliases: ['pandas', 'dataframe'], cat: 'ml' },
  { name: 'NumPy', aliases: ['numpy', 'np'], cat: 'ml' },
  { name: 'OpenCV', aliases: ['opencv', 'cv2', 'computer vision'], cat: 'ml' },
  { name: 'Hugging Face', aliases: ['hugging face', 'huggingface', 'transformers'], cat: 'ml' },
  { name: 'LangChain', aliases: ['langchain', 'lang chain'], cat: 'ml' },
  { name: 'NLP', aliases: ['nlp', 'natural language processing', 'text processing', 'sentiment analysis'], cat: 'ml' },
  { name: 'Deep Learning', aliases: ['deep learning', 'neural network', 'neural networks', 'cnn', 'rnn', 'lstm', 'transformer'], cat: 'ml' },
  { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning', 'classification', 'regression'], cat: 'ml' },
  { name: 'MLOps', aliases: ['mlops', 'mlflow', 'kubeflow', 'model deployment'], cat: 'ml' },
  { name: 'LLM', aliases: ['llm', 'large language model', 'gpt', 'chatgpt', 'openai', 'gemini', 'generative ai', 'gen ai'], cat: 'ml' },
  { name: 'RAG', aliases: ['rag', 'retrieval augmented generation', 'vector database', 'pinecone', 'weaviate', 'chromadb'], cat: 'ml' },
  { name: 'Feature Engineering', aliases: ['feature engineering', 'feature selection', 'feature extraction'], cat: 'ml' },
  // ── Data ──
  { name: 'Apache Spark', aliases: ['spark', 'pyspark', 'apache spark'], cat: 'data' },
  { name: 'Hadoop', aliases: ['hadoop', 'hdfs', 'mapreduce'], cat: 'data' },
  { name: 'Tableau', aliases: ['tableau'], cat: 'data' },
  { name: 'Power BI', aliases: ['power bi', 'powerbi'], cat: 'data' },
  { name: 'Apache Kafka', aliases: ['kafka', 'apache kafka', 'event streaming', 'message queue'], cat: 'data' },
  { name: 'Airflow', aliases: ['airflow', 'apache airflow'], cat: 'data' },
  { name: 'Snowflake', aliases: ['snowflake'], cat: 'data' },
  { name: 'dbt', aliases: ['dbt', 'data build tool'], cat: 'data' },
  { name: 'Data Visualization', aliases: ['data visualization', 'data viz', 'matplotlib', 'plotly', 'seaborn', 'd3', 'd3.js', 'chart'], cat: 'data' },
  { name: 'ETL', aliases: ['etl', 'data pipeline', 'data pipelines', 'data engineering'], cat: 'data' },
  { name: 'Statistics', aliases: ['statistics', 'statistical analysis', 'hypothesis testing', 'probability', 'bayesian'], cat: 'data' },
  { name: 'A/B Testing', aliases: ['a/b testing', 'ab testing', 'experimentation', 'a/b test'], cat: 'data' },
  // ── Concepts / Practices ──
  { name: 'Data Structures & Algorithms', aliases: ['data structures', 'algorithms', 'dsa', 'leetcode', 'competitive programming', 'sorting', 'searching', 'dynamic programming'], cat: 'concept' },
  { name: 'System Design', aliases: ['system design', 'architecture', 'scalability', 'high availability', 'distributed systems', 'load balancing', 'microservices'], cat: 'concept' },
  { name: 'OOP', aliases: ['oop', 'object oriented', 'object-oriented', 'design patterns', 'solid principles', 'solid'], cat: 'concept' },
  { name: 'Testing', aliases: ['testing', 'unit test', 'unit testing', 'integration test', 'e2e', 'jest', 'mocha', 'pytest', 'selenium', 'cypress', 'playwright', 'tdd'], cat: 'concept' },
  { name: 'Agile', aliases: ['agile', 'scrum', 'kanban', 'sprint', 'jira', 'agile methodology'], cat: 'concept' },
  { name: 'Git', aliases: ['git', 'github', 'gitlab', 'bitbucket', 'version control', 'source control'], cat: 'concept' },
  { name: 'Security', aliases: ['security', 'authentication', 'authorization', 'oauth', 'jwt', 'ssl', 'https', 'encryption', 'owasp', 'cybersecurity'], cat: 'concept' },
  { name: 'Performance Optimization', aliases: ['performance optimization', 'caching', 'lazy loading', 'code splitting', 'lighthouse', 'web vitals', 'core web vitals'], cat: 'concept' },
  { name: 'Accessibility', aliases: ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader'], cat: 'concept' },
  { name: 'Microservices', aliases: ['microservices', 'micro services', 'service oriented', 'soa'], cat: 'concept' },
  { name: 'Message Queues', aliases: ['message queue', 'rabbitmq', 'sqs', 'pub/sub', 'pubsub', 'event driven'], cat: 'concept' },
  // ── Mobile ──
  { name: 'React Native', aliases: ['react native', 'react-native'], cat: 'mobile' },
  { name: 'Flutter', aliases: ['flutter', 'dart'], cat: 'mobile' },
  { name: 'Android', aliases: ['android', 'android development'], cat: 'mobile' },
  { name: 'iOS', aliases: ['ios', 'ios development', 'xcode'], cat: 'mobile' },
  // ── Digital Marketing & Business ──
  { name: 'Digital Marketing', aliases: ['digital marketing', 'marketing', 'sem', 'social media marketing', 'email marketing'], cat: 'business' },
  { name: 'SEO', aliases: ['seo', 'search engine optimization', 'on-page seo', 'off-page seo'], cat: 'business' },
  { name: 'Content Creation', aliases: ['content creation', 'creative writing', 'copywriting', 'blogging', 'content strategy'], cat: 'business' },
  { name: 'Business Analytics', aliases: ['business analytics', 'business intelligence', 'data analysis', 'google analytics', 'mixpanel'], cat: 'business' },
  { name: 'Business Communication', aliases: ['business communication', 'communication', 'stakeholder management', 'client communication'], cat: 'business' },
];

/* ═══════════════════════════════════════════════════════════════════
   LEARNING RESOURCES DATABASE — used to generate roadmaps
   ═══════════════════════════════════════════════════════════════════ */
const LEARNING_RESOURCES = {
  'JavaScript': { learn: 'Closures, prototypes, event loop, async/await, ES6+ features, modules, error handling', resource: 'JavaScript.info (website) + Fireship JS series (YouTube)', project: 'Build a promise-based HTTP client library from scratch' },
  'TypeScript': { learn: 'Type system, generics, utility types, strict mode, interfaces vs types, discriminated unions', resource: 'TypeScript Official Handbook + Matt Pocock (YouTube)', project: 'Convert an existing JS project to TypeScript with strict mode' },
  'Python': { learn: 'Advanced Python: decorators, generators, async, data classes, type hints', resource: 'Corey Schafer Python Tutorials (YouTube)', project: 'Build a CLI tool with async file processing and proper error handling' },
  'Java': { learn: 'OOP deep dive, Collections framework, Streams API, multithreading, JVM internals', resource: 'Bro Code Java Course (YouTube) + Baeldung blog', project: 'Build a multi-threaded file processor with Java Streams' },
  'C++': { learn: 'Modern C++ (C++17/20), smart pointers, STL, templates, memory management', resource: 'The Cherno C++ Series (YouTube)', project: 'Build a custom data structure library with templates' },
  'React': { learn: 'Hooks deep dive, custom hooks, React patterns, Server Components, performance optimization', resource: 'React Official Docs (new) + Jack Herrington (YouTube)', project: 'Build a full-stack React app with hooks, context, and API integration' },
  'Angular': { learn: 'Components, services, RxJS, dependency injection, routing, forms, NgModules', resource: 'Angular Official Tutorial + Decoded Frontend (YouTube)', project: 'Build a task management app with Angular and RxJS' },
  'Vue.js': { learn: 'Composition API, Pinia state management, Vue Router, reactivity system', resource: 'Vue.js Official Guide + Vue Mastery (YouTube)', project: 'Build an e-commerce storefront with Vue 3 Composition API' },
  'Next.js': { learn: 'App Router, Server Components, SSR/SSG/ISR, API routes, middleware, metadata API', resource: 'Next.js Official Learn Course (free)', project: 'Build a blog platform with Next.js App Router, MDX, and dynamic OG images' },
  'Tailwind CSS': { learn: 'Utility-first workflow, responsive design, custom themes, component extraction', resource: 'Tailwind CSS Docs + Kevin Powell (YouTube)', project: 'Build a design system with reusable Tailwind components' },
  'Node.js': { learn: 'Event loop, streams, child processes, clustering, error handling patterns', resource: 'Node.js Official Guides + Traversy Media (YouTube)', project: 'Build a real-time chat server with clustering and graceful shutdown' },
  'Express': { learn: 'Middleware patterns, error handling, routing, validation, security best practices', resource: 'Express Docs + Web Dev Simplified (YouTube)', project: 'Build a production REST API with auth, validation, and rate limiting' },
  'Django': { learn: 'Models, views, templates, Django REST Framework, ORM, admin panel, signals', resource: 'Django Official Tutorial + Corey Schafer (YouTube)', project: 'Build a full CRUD API with Django REST Framework and authentication' },
  'Flask': { learn: 'Routes, blueprints, extensions, SQLAlchemy integration, JWT auth', resource: 'Miguel Grinberg Flask Mega-Tutorial (free)', project: 'Build a RESTful microservice with Flask and SQLAlchemy' },
  'FastAPI': { learn: 'Path/query params, Pydantic models, async endpoints, dependency injection, docs', resource: 'FastAPI Official Tutorial + ArjanCodes (YouTube)', project: 'Build a high-performance API with FastAPI, async DB, and auto-generated docs' },
  'Spring Boot': { learn: 'Dependency injection, JPA/Hibernate, REST controllers, Spring Security, profiles', resource: 'Amigoscode Spring Boot (YouTube) + Spring Official Guides', project: 'Build a CRUD REST API with Spring Boot, JPA, and JWT auth' },
  'MongoDB': { learn: 'Document modeling, aggregation pipeline, indexing, transactions, Mongoose ODM', resource: 'MongoDB University (free) + Traversy Media', project: 'Build and optimize a database schema for a social media platform' },
  'PostgreSQL': { learn: 'Relational modeling, complex queries, indexing strategies, ACID, stored procedures', resource: 'PostgreSQL Tutorial (website) + Hussein Nasser (YouTube)', project: 'Design a normalized e-commerce database with optimized queries' },
  'Redis': { learn: 'Data structures, caching patterns (cache-aside, write-through), pub/sub, sessions', resource: 'Redis University (free) + Hussein Nasser', project: 'Add Redis caching to an API and measure the performance improvement' },
  'Docker': { learn: 'Dockerfile best practices, multi-stage builds, Docker Compose, networking, volumes', resource: 'TechWorld with Nana Docker Course (YouTube)', project: 'Containerize a full-stack app (frontend + API + DB) with Docker Compose' },
  'Kubernetes': { learn: 'Pods, Services, Deployments, ConfigMaps, Secrets, Helm charts, kubectl', resource: 'KodeKloud Free K8s Labs + Kubernetes Docs', project: 'Deploy a microservices app on a local Kubernetes cluster with Helm' },
  'AWS': { learn: 'EC2, S3, Lambda, VPC, IAM, RDS, SQS — core services and best practices', resource: 'AWS Free Tier + freeCodeCamp AWS Course (YouTube)', project: 'Deploy a full application on AWS with EC2, RDS, and S3' },
  'Terraform': { learn: 'HCL syntax, providers, state management, modules, workspaces', resource: 'HashiCorp Terraform Tutorials (official)', project: 'Provision complete cloud infrastructure using Terraform modules' },
  'CI/CD': { learn: 'Pipeline design, automated testing, deployment strategies, environment management', resource: 'GitHub Actions Docs + Fireship CI/CD video', project: 'Create a CI/CD pipeline: lint → test → build → deploy on every push' },
  'Git': { learn: 'Branching strategies, rebasing, cherry-picking, hooks, collaborative workflows', resource: 'Git Official Book (free) + Fireship Git video', project: 'Set up a team Git workflow with branch protection and PR templates' },
  'Data Structures & Algorithms': { learn: 'Arrays, trees, graphs, dynamic programming, Big O analysis, problem patterns', resource: 'NeetCode 150 (YouTube) + LeetCode', project: 'Solve 50 LeetCode problems across all major patterns' },
  'System Design': { learn: 'Load balancers, caching, sharding, CAP theorem, message queues, CDN', resource: 'System Design Primer (GitHub) + Gaurav Sen (YouTube)', project: 'Design a URL shortener system — draw architecture and implement core API' },
  'Testing': { learn: 'Unit testing, integration testing, E2E testing, TDD approach, mocking', resource: 'Kent C. Dodds Testing JavaScript + framework-specific docs', project: 'Write comprehensive tests for a full-stack app with 80%+ coverage' },
  'GraphQL': { learn: 'Schema design, resolvers, mutations, subscriptions, DataLoader for N+1', resource: 'Apollo GraphQL Tutorials + How to GraphQL', project: 'Build a GraphQL API with real-time subscriptions' },
  'TensorFlow': { learn: 'Neural networks, CNNs, transfer learning, model saving/loading, TensorFlow Lite', resource: 'TensorFlow Official Tutorials + Sentdex (YouTube)', project: 'Train and deploy an image classification model with TensorFlow' },
  'PyTorch': { learn: 'Tensors, autograd, custom datasets, training loops, model architecture', resource: 'PyTorch Official Tutorials + Andrej Karpathy (YouTube)', project: 'Train a CNN on CIFAR-10 achieving 85%+ accuracy' },
  'Scikit-learn': { learn: 'Classification, regression, clustering, model evaluation, cross-validation, pipelines', resource: 'Andrew Ng ML Specialization + Scikit-learn Docs', project: 'Build an end-to-end ML pipeline: data → features → model → evaluation' },
  'Machine Learning': { learn: 'Supervised/unsupervised algorithms, model selection, bias-variance, ensemble methods', resource: 'Andrew Ng ML Specialization (Coursera, free audit)', project: 'Build a complete ML pipeline with feature engineering and model comparison' },
  'Deep Learning': { learn: 'Neural network architectures, backpropagation, CNNs, RNNs, Transformers', resource: 'Fast.ai Practical Deep Learning (free) + 3Blue1Brown', project: 'Implement a transformer-based model from scratch' },
  'NLP': { learn: 'Tokenization, embeddings, attention mechanism, sentiment analysis, text classification', resource: 'Hugging Face NLP Course (free) + Jay Alammar blog', project: 'Fine-tune a BERT model for text classification' },
  'LangChain': { learn: 'Chains, agents, memory, RAG pipelines, tool use, output parsers', resource: 'LangChain Docs + DeepLearning.AI LangChain course', project: 'Build a RAG chatbot that answers questions from PDF documents' },
  'LLM': { learn: 'Prompt engineering, fine-tuning, function calling, evaluation, safety', resource: 'DeepLearning.AI courses + OpenAI Cookbook', project: 'Build an AI agent with function calling and multi-step reasoning' },
  'Pandas': { learn: 'DataFrame operations, groupby, merge/join, time series, data cleaning', resource: 'Kaggle Pandas Course (free) + Corey Schafer', project: 'Clean and analyze a real-world messy dataset end-to-end' },
  'NumPy': { learn: 'Array operations, broadcasting, linear algebra, random sampling', resource: 'NumPy Official Tutorial + Keith Galli (YouTube)', project: 'Implement gradient descent and basic neural network with NumPy only' },
  'Apache Spark': { learn: 'Spark DataFrames, transformations, actions, Spark ML, optimization', resource: 'Spark by Examples + Databricks Free Training', project: 'Process a large dataset with PySpark and build a distributed ML model' },
  'Data Visualization': { learn: 'Chart selection, Plotly interactive charts, Seaborn statistical plots, dashboards', resource: 'Python Graph Gallery + Plotly Docs', project: 'Create an interactive dashboard analyzing real-world data' },
  'Statistics': { learn: 'Hypothesis testing, confidence intervals, regression analysis, Bayesian methods', resource: 'StatQuest with Josh Starmer (YouTube) + Khan Academy', project: 'Perform a complete statistical analysis on a real-world dataset' },
  'Security': { learn: 'OAuth 2.0, JWT best practices, XSS/CSRF prevention, OWASP Top 10, encryption', resource: 'OWASP Guidelines + Auth0 Blog + PortSwigger Academy', project: 'Implement a secure auth system with OAuth, 2FA, and security headers' },
  'Microservices': { learn: 'Service decomposition, API gateways, inter-service communication, saga pattern', resource: 'Microservices.io Patterns + Hussein Nasser (YouTube)', project: 'Split a monolith into microservices with API gateway and service discovery' },
  'Message Queues': { learn: 'RabbitMQ, async processing, dead letter queues, event-driven architecture', resource: 'RabbitMQ Tutorials (official) + CodeOpinion (YouTube)', project: 'Build an order processing system with async email and inventory updates' },
  'Performance Optimization': { learn: 'Core Web Vitals, lazy loading, code splitting, caching strategies, profiling', resource: 'web.dev Performance Course + Chrome DevTools docs', project: 'Audit and optimize a website to achieve 95+ Lighthouse performance score' },
  'Accessibility': { learn: 'WCAG 2.1 guidelines, ARIA attributes, keyboard navigation, screen reader testing', resource: 'Deque University (free courses) + web.dev accessibility', project: 'Audit and fix accessibility issues to achieve WCAG AA compliance' },
  'Apache Kafka': { learn: 'Topics, producers/consumers, partitions, consumer groups, Kafka Streams', resource: 'Confluent Kafka Tutorials + Stephane Maarek (YouTube)', project: 'Build a real-time event streaming pipeline with Kafka' },
  'Agile': { learn: 'Scrum framework, sprint planning, retrospectives, Kanban, user stories', resource: 'Scrum.org Free Resources + Atlassian Agile Guide', project: 'Run a 2-week sprint for a personal project using Scrum methodology' },
  'OOP': { learn: 'SOLID principles, design patterns (Factory, Observer, Strategy), composition vs inheritance', resource: 'Head First Design Patterns + Derek Banas (YouTube)', project: 'Refactor a codebase to apply SOLID principles and 3 design patterns' },
  'React Native': { learn: 'Core components, navigation, state management, native modules, deployment', resource: 'React Native Official Docs + William Candillon (YouTube)', project: 'Build a cross-platform mobile app with navigation and API integration' },
  'Flutter': { learn: 'Widgets, state management (Riverpod/Bloc), navigation, platform channels', resource: 'Flutter Official Codelabs + Reso Coder (YouTube)', project: 'Build a cross-platform app with Flutter and Firebase backend' },
  'MLOps': { learn: 'Experiment tracking (MLflow), model versioning, data pipelines, monitoring', resource: 'MLOps Zoomcamp (free, DataTalksClub)', project: 'Set up a complete MLOps pipeline: training → tracking → deployment → monitoring' },
  'RAG': { learn: 'Embedding models, vector similarity, chunking strategies, hybrid search', resource: 'Pinecone Learning Center + James Briggs (YouTube)', project: 'Build a semantic search engine over a large document corpus' },
  'Feature Engineering': { learn: 'Encoding, missing data, feature scaling, feature selection, domain features', resource: 'Kaggle Feature Engineering Course (free)', project: 'Engineer features for a Kaggle dataset and measure model improvement' },
  'A/B Testing': { learn: 'Experiment design, sample size, statistical significance, Bayesian A/B testing', resource: 'Evan Miller A/B Testing Tools + Udacity Course', project: 'Design, run, and analyze a simulated A/B test with statistical rigor' },
  'Elasticsearch': { learn: 'Indexing, querying, aggregations, mapping, relevance tuning', resource: 'Elastic Official Docs + Bo Andersen Elasticsearch Course', project: 'Build a full-text search engine with autocomplete and faceted filtering' },
  'Nginx': { learn: 'Reverse proxy, load balancing, SSL termination, rate limiting, static serving', resource: 'DigitalOcean Nginx Tutorials + Hussein Nasser', project: 'Configure Nginx as reverse proxy with SSL and load balancing for an app' },
  'Linux': { learn: 'Command line mastery, file permissions, process management, networking, shell scripting', resource: 'Linux Journey (free) + The Linux Command Line book', project: 'Set up and configure a Linux server from scratch with security hardening' },
  
  // Digital Marketing & Business
  'Digital Marketing': { learn: 'Campaign strategy, customer journey, performance marketing, KPIs, email automation', resource: 'HubSpot Academy (Free) + Google Digital Garage', project: 'Design a 360-degree digital marketing campaign for a mock SaaS product' },
  'SEO': { learn: 'Keyword research, on-page optimization, backlink building, technical SEO, Google Search Console', resource: 'Ahrefs Academy + Moz Beginner Guide to SEO', project: 'Perform a comprehensive SEO audit and keyword strategy for a local business' },
  'Content Creation': { learn: 'Copywriting, content calendars, storytelling, content repurposing, social media writing', resource: 'CopyBlogger + Neil Patel Blog', project: 'Create a 1-month content calendar with 5 polished long-form blog posts' },
  'Business Analytics': { learn: 'Google Analytics 4, conversion rate optimization, funnel analysis, UTM tracking', resource: 'Google Analytics Academy + MeasureSchool (YouTube)', project: 'Set up GA4 event tracking and build a custom conversion funnel dashboard' },
  'Business Communication': { learn: 'Stakeholder management, clear presentation skills, professional writing, negotiation', resource: 'Harvard Business Review + LinkedIn Learning', project: 'Draft a project proposal, status report, and executive summary presentation' },
};

/* ═══════════════════════════════════════════════════════════════════
   ROLE REQUIREMENTS — predefined skill sets for each role
   ═══════════════════════════════════════════════════════════════════ */
const ROLE_REQUIREMENTS = {
  swe: {
    critical: ['Data Structures & Algorithms', 'System Design', 'Git', 'Testing'],
    important: ['Docker', 'CI/CD', 'TypeScript', 'SQL', 'REST APIs', 'OOP'],
    nice: ['GraphQL', 'Microservices', 'Kubernetes', 'Message Queues', 'Performance Optimization'],
  },
  aiml: {
    critical: ['Python', 'PyTorch', 'Deep Learning', 'Machine Learning', 'LangChain'],
    important: ['NLP', 'MLOps', 'FastAPI', 'Docker', 'Statistics', 'NumPy', 'Pandas'],
    nice: ['RAG', 'LLM', 'Feature Engineering', 'Apache Spark', 'Kubernetes'],
  },
  devops: {
    critical: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Linux'],
    important: ['CI/CD', 'GitHub Actions', 'Ansible', 'Prometheus', 'Grafana', 'Nginx'],
    nice: ['ArgoCD', 'Apache Kafka', 'Security', 'Python', 'Shell/Bash'],
  },
  datascience: {
    critical: ['Python', 'Machine Learning', 'Scikit-learn', 'Statistics', 'Data Visualization'],
    important: ['Pandas', 'NumPy', 'Feature Engineering', 'SQL', 'Deep Learning', 'A/B Testing'],
    nice: ['Apache Spark', 'Tableau', 'Power BI', 'Snowflake', 'Apache Kafka'],
  },
  frontend: {
    critical: ['JavaScript', 'React', 'TypeScript', 'Next.js', 'CSS'],
    important: ['Tailwind CSS', 'Redux', 'Testing', 'Responsive Design', 'Performance Optimization', 'Git'],
    nice: ['Accessibility', 'Framer Motion', 'Vue.js', 'Angular', 'Webpack'],
  },
  backend: {
    critical: ['Node.js', 'PostgreSQL', 'REST APIs', 'Security', 'System Design'],
    important: ['Docker', 'Redis', 'Testing', 'CI/CD', 'MongoDB', 'SQL'],
    nice: ['GraphQL', 'Message Queues', 'Microservices', 'gRPC', 'Kubernetes', 'Nginx'],
  },
};

/* ═══════════════════════════════════════════════════════════════════
   LOCAL ANALYSIS ENGINE — the core intelligence
   ═══════════════════════════════════════════════════════════════════ */

// Proficiency indicators in text
const STRONG_INDICATORS = ['proficient', 'expert', 'advanced', 'extensive', 'lead', 'architected', 'spearheaded', 'mastered', 'in-depth', '3+ years', '4+ years', '5+ years', '3 years', '4 years', '5 years', 'senior'];
const MODERATE_INDICATORS = ['experience', 'worked with', 'developed', 'built', 'implemented', 'created', 'designed', 'used', 'utilized', '1 year', '2 years', '1+ year', '2+ years', 'hands-on', 'project'];
const WEAK_INDICATORS = ['basic', 'beginner', 'learning', 'exposure', 'coursework', 'familiar', 'introduction', 'fundamentals', 'awareness', 'knowledge of'];

// Priority section indicators in JD
const CRITICAL_INDICATORS = ['required', 'must have', 'must-have', 'mandatory', 'essential', 'minimum', 'requirements:', 'qualifications:', 'you must', 'need to have', 'require'];
const NICE_INDICATORS = ['preferred', 'nice to have', 'nice-to-have', 'bonus', 'plus', 'good to have', 'desirable', 'advantageous', 'ideally', 'optional'];

function matchSkillInText(text, skill) {
  for (const alias of skill.aliases) {
    // Handle special regex aliases (like \bR\b)
    if (alias.startsWith('\\b')) {
      try {
        if (new RegExp(alias, 'gi').test(text)) return true;
      } catch { /* ignore */ }
      continue;
    }
    
    // Always use word boundaries to avoid partial matches (e.g., 'rest' matching 'interest')
    const isWordStart = /^\w/.test(alias);
    const isWordEnd = /\w$/.test(alias);
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = isWordStart ? '\\b' : '';
    const suffix = isWordEnd ? '\\b' : '';
    
    if (new RegExp(`${prefix}${escaped}${suffix}`, 'gi').test(text)) return true;
  }
  return false;
}

function countOccurrences(text, skill) {
  let count = 0;
  for (const alias of skill.aliases) {
    if (alias.startsWith('\\b')) continue;
    const isWordStart = /^\w/.test(alias);
    const isWordEnd = /\w$/.test(alias);
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = isWordStart ? '\\b' : '';
    const suffix = isWordEnd ? '\\b' : '';
    
    const matches = text.match(new RegExp(`${prefix}${escaped}${suffix}`, 'gi'));
    if (matches) count += matches.length;
  }
  return count;
}

function determineProficiency(text, skill) {
  const occurrences = countOccurrences(text, skill);
  let contextScore = 0;

  for (const alias of skill.aliases) {
    if (alias.startsWith('\\b')) continue;
    
    const isWordStart = /^\w/.test(alias);
    const isWordEnd = /\w$/.test(alias);
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = isWordStart ? '\\b' : '';
    const suffix = isWordEnd ? '\\b' : '';
    
    const regex = new RegExp(`${prefix}${escaped}${suffix}`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const idx = match.index;
      const surroundStart = Math.max(0, idx - 120);
      const surroundEnd = Math.min(text.length, idx + match[0].length + 120);
      const context = text.substring(surroundStart, surroundEnd).toLowerCase();

      for (const indicator of STRONG_INDICATORS) {
        if (context.includes(indicator)) contextScore += 3;
      }
      for (const indicator of MODERATE_INDICATORS) {
        if (context.includes(indicator)) contextScore += 1;
      }
      for (const indicator of WEAK_INDICATORS) {
        if (context.includes(indicator)) contextScore -= 1;
      }
    }
  }

  const totalScore = occurrences * 2 + contextScore;

  if (totalScore >= 6) return 'strong';
  if (totalScore >= 2) return 'moderate';
  return 'weak';
}

function parseResumeSkills(resumeText) {
  const detected = [];
  for (const skill of SKILL_DB) {
    if (matchSkillInText(resumeText, skill)) {
      detected.push({
        name: skill.name,
        level: determineProficiency(resumeText, skill),
        cat: skill.cat,
      });
    }
  }
  return detected;
}

function parseJDRequirements(jdText) {
  const lower = jdText.toLowerCase();
  const requirements = [];

  // Detect section boundaries
  const lines = jdText.split('\n');
  let currentSection = 'important'; // default

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    // Detect section changes
    for (const ind of CRITICAL_INDICATORS) {
      if (lineLower.includes(ind)) { currentSection = 'critical'; break; }
    }
    for (const ind of NICE_INDICATORS) {
      if (lineLower.includes(ind)) { currentSection = 'nice'; break; }
    }
  }

  // Now find all skills mentioned in the JD and assign priority
  for (const skill of SKILL_DB) {
    if (matchSkillInText(jdText, skill)) {
      // Determine priority based on where in the JD the skill appears
      let priority = 'important';
      for (const alias of skill.aliases) {
        if (alias.startsWith('\\b')) continue;
        
        const isWordStart = /^\w/.test(alias);
        const isWordEnd = /\w/.test(alias);
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefix = isWordStart ? '\\b' : '';
        const suffix = isWordEnd ? '\\b' : '';
        
        const regex = new RegExp(`${prefix}${escaped}${suffix}`, 'gi');
        const match = regex.exec(jdText);
        if (!match) continue;

        // Check surrounding text for priority cues
        const idx = match.index;
        const surroundStart = Math.max(0, idx - 200);
        const surround = jdText.substring(surroundStart, idx + match[0].length + 50).toLowerCase();

        let isCritical = false, isNice = false;
        for (const ind of CRITICAL_INDICATORS) { if (surround.includes(ind)) isCritical = true; }
        for (const ind of NICE_INDICATORS) { if (surround.includes(ind)) isNice = true; }

        if (isCritical) priority = 'critical';
        else if (isNice) priority = 'nice';
        break;
      }

      requirements.push({ name: skill.name, priority, cat: skill.cat });
    }
  }

  return requirements;
}

function analyzeLocally(resumeText, target, mode, roleId) {
  // 1. Parse resume skills
  const resumeSkills = parseResumeSkills(resumeText);
  const resumeSkillNames = new Set(resumeSkills.map(s => s.name));

  // 2. Get requirements based on mode
  let requiredSkills = [];
  let label = '';

  if (mode === 'role' && roleId && ROLE_REQUIREMENTS[roleId]) {
    const reqs = ROLE_REQUIREMENTS[roleId];
    const roleLabels = { swe: 'Software Developer', aiml: 'AI / ML Engineer', devops: 'DevOps / Cloud Engineer', datascience: 'Data Scientist', frontend: 'Frontend Developer', backend: 'Backend Developer' };
    label = roleLabels[roleId] || roleId;

    for (const skill of reqs.critical) {
      requiredSkills.push({ name: skill, priority: 'critical' });
    }
    for (const skill of reqs.important) {
      requiredSkills.push({ name: skill, priority: 'important' });
    }
    for (const skill of reqs.nice) {
      requiredSkills.push({ name: skill, priority: 'nice' });
    }
  } else {
    // JD mode
    requiredSkills = parseJDRequirements(target);
    label = target.split('\n')[0].substring(0, 60) || 'Custom Role';

    // If the JD has a separate title, use it
    if (mode === 'jd') {
      const firstLine = target.split('\n')[0].trim();
      if (firstLine.length > 0 && firstLine.length < 80) {
        label = firstLine;
      }
    }
  }

  // 3. Identify gaps — required skills NOT strong in resume
  const gapSkills = requiredSkills.filter(req => {
    const found = resumeSkills.find(rs => rs.name === req.name);
    return !found || found.level === 'weak';
  });

  // Skills user has that overlap with requirements
  const matchedSkills = requiredSkills.filter(req => {
    const found = resumeSkills.find(rs => rs.name === req.name);
    return found && (found.level === 'strong' || found.level === 'moderate');
  });

  // 4. Calculate readiness score
  let totalWeight = 0, matchedWeight = 0;
  const priorityWeights = { critical: 4, important: 2, nice: 1 };

  for (const req of requiredSkills) {
    const w = priorityWeights[req.priority] || 1;
    totalWeight += w;
    const found = resumeSkills.find(rs => rs.name === req.name);
    if (found) {
      if (found.level === 'strong') matchedWeight += w;
      else if (found.level === 'moderate') matchedWeight += w * 0.8;
      else if (found.level === 'weak') matchedWeight += w * 0.4;
    }
  }

  // Add a generous bonus for having strong technical skills overall
  const extraSkillsCount = resumeSkills.filter(rs => rs.level === 'strong').length;
  const experienceBonus = Math.min(totalWeight * 0.25, extraSkillsCount * 0.5);
  matchedWeight += experienceBonus;

  let baseScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 50;
  
  // Apply a generous curve to motivate the user, bounded at 98% (always room to grow!)
  let readinessScore = Math.min(98, Math.round(baseScore * 0.8 + 20));

  // 5. Generate roadmap from gaps
  const roadmap = [];
  const sortedGaps = [...gapSkills].sort((a, b) => {
    const order = { critical: 0, important: 1, nice: 2 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  });

  let weekNum = 1;
  for (const gap of sortedGaps) {
    const res = LEARNING_RESOURCES[gap.name];
    if (res) {
      roadmap.push({
        week: weekNum,
        title: gap.name,
        learn: res.learn,
        resource: res.resource,
        miniProject: res.project,
      });
    } else {
      roadmap.push({
        week: weekNum,
        title: gap.name,
        learn: `Study ${gap.name} fundamentals, core concepts, and best practices`,
        resource: `Official ${gap.name} documentation + YouTube tutorials`,
        miniProject: `Build a hands-on project demonstrating ${gap.name} skills`,
      });
    }
    weekNum++;
    if (weekNum > 12) break;
  }

  // If roadmap is too short, pad with interview prep and portfolio
  if (roadmap.length < 6) {
    if (!roadmap.find(r => r.title === 'Interview Preparation')) {
      roadmap.push({
        week: roadmap.length + 1,
        title: 'Interview Preparation',
        learn: 'Practice coding challenges, system design interviews, behavioral questions (STAR method)',
        resource: 'LeetCode + Pramp (free mock interviews) + Interviewing.io',
        miniProject: 'Complete 5 mock interviews and refine your STAR stories',
      });
    }
    if (!roadmap.find(r => r.title === 'Portfolio & Projects')) {
      roadmap.push({
        week: roadmap.length + 1,
        title: 'Portfolio & Projects',
        learn: 'Build showcase projects, write clean READMEs, deploy live demos, contribute to open source',
        resource: 'GitHub profile optimization + Vercel/Railway for deployment',
        miniProject: 'Ship 2-3 polished projects with live demos and comprehensive documentation',
      });
    }
  }

  // 6. Community data
  const communityLearning = gapSkills.slice(0, 3).map(g => g.name);
  if (communityLearning.length < 3) {
    const fallbackSkills = ['React', 'Python', 'System Design', 'Docker', 'TypeScript'];
    for (const fs of fallbackSkills) {
      if (communityLearning.length >= 3) break;
      if (!communityLearning.includes(fs)) communityLearning.push(fs);
    }
  }

  return {
    label,
    detectedSkills: resumeSkills.length > 0 ? resumeSkills : [{ name: 'No skills detected', level: 'weak' }],
    requiredSkills: gapSkills.length > 0 ? gapSkills : requiredSkills,
    readinessScore: Math.max(10, Math.min(95, readinessScore)),
    roadmap,
    communityLearning,
    communityCount: Math.floor(Math.random() * 300) + 150,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   DEPRECATED: Gemini API integration removed
   ═══════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════
   ROLE CONFIG — icons and gradient colors
   ═══════════════════════════════════════════════════════════════════ */
const ROLES = [
  { id: 'swe', label: 'Software Developer', icon: Code2, gradient: 'linear-gradient(135deg, #4F6EF7, #3B82F6)' },
  { id: 'aiml', label: 'AI / ML Engineer', icon: Brain, gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)' },
  { id: 'devops', label: 'DevOps / Cloud', icon: Cloud, gradient: 'linear-gradient(135deg, #06B6D4, #0EA5E9)' },
  { id: 'datascience', label: 'Data Scientist', icon: BarChart3, gradient: 'linear-gradient(135deg, #F59E0B, #EAB308)' },
  { id: 'frontend', label: 'Frontend Dev', icon: Layout, gradient: 'linear-gradient(135deg, #EC4899, #F43F5E)' },
  { id: 'backend', label: 'Backend Dev', icon: Server, gradient: 'linear-gradient(135deg, #22C55E, #10B981)' },
];

/* ═══════════════════════════════════════════════════════════════════
   LOADING MESSAGES
   ═══════════════════════════════════════════════════════════════════ */
const AI_LOADING = ['Extracting text from your resume...', 'Sending to Gemini AI...', 'Mapping skills to requirements...', 'Identifying skill gaps...', 'Generating your roadmap...', 'Almost ready...'];
const LOCAL_LOADING = ['Extracting text from your resume...', 'Analyzing your skills...', 'Matching against requirements...', 'Calculating readiness score...', 'Building your learning roadmap...', 'Almost ready...'];

/* ═══════════════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════════════ */
function StarParticles() {
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1, delay: `${Math.random() * 5}s`, duration: `${Math.random() * 3 + 2}s`,
  })), []);
  return (
    <div className="stars-container">
      {stars.map(s => <div key={s.id} className="star" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />)}
    </div>
  );
}

function AuroraBackground() {
  return <div className="aurora-bg"><div className="aurora-blob" /><div className="aurora-blob" /><div className="aurora-blob" /></div>;
}

function ProgressRing({ value, size = 180, strokeWidth = 10 }) {
  const [av, setAv] = useState(0);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  useEffect(() => {
    const t = setTimeout(() => { let s = 0; const step = () => { s += 1; if (s <= value) { setAv(s); requestAnimationFrame(step); } }; requestAnimationFrame(step); }, 300);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4F6EF7" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient></defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E1E2E" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (av/100)*c} style={{ transition: 'stroke-dashoffset 0.05s ease' }} />
      </svg>
      <div className="progress-ring-text"><div className="progress-ring-value">{av}%</div><div className="progress-ring-label">Job Ready</div></div>
    </div>
  );
}

function RippleButton({ children, className = 'btn-primary', onClick, disabled, style }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`; ripple.style.top = `${e.clientY - rect.top}px`;
    ref.current.appendChild(ripple); setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} className={className} onClick={handleClick} disabled={disabled} style={style}>{children}</button>;
}

/* ═══════════════════════════════════════════════════════════════════
   STEP INDICATOR
   ═══════════════════════════════════════════════════════════════════ */
function StepIndicator({ currentStep }) {
  const steps = [{ num: 1, label: 'Upload' }, { num: 2, label: 'Target' }, { num: 3, label: 'Analysis' }, { num: 4, label: 'Dashboard' }];
  return (
    <div className="step-indicator">
      {steps.map((step, i) => (
        <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step-dot ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}>
            {currentStep > step.num ? <Check size={16} /> : step.num}
            <span className="step-label">{step.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${currentStep > step.num ? 'active' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 1: UPLOAD SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function UploadScreen({ onFileSelect, file }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

  return (
    <div className="page-enter" style={{ maxWidth: 640, margin: '0 auto', padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 24, background: 'linear-gradient(135deg, rgba(79,110,247,0.12), rgba(124,58,237,0.12))', border: '1px solid rgba(79,110,247,0.2)', fontSize: 13, fontWeight: 600, color: '#4F6EF7', marginBottom: 24 }}>
          <Rocket size={14} /> AI Career Navigator
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, background: 'linear-gradient(135deg, #F0F0F5, #8888A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Your<br /><span style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Path</span>
        </h1>
        <p style={{ fontSize: 16, color: '#8888A0', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
          Upload your resume and let AI analyze your skills, identify gaps, and create a personalized week-by-week learning roadmap.
        </p>
      </div>

      <div className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={(e) => { if (e.target.files[0]) onFileSelect(e.target.files[0]); }} style={{ display: 'none' }} />
        <div className="upload-icon">
          {file ? <CheckCircle2 size={32} color="#22C55E" /> : <Upload size={32} color="#4F6EF7" />}
        </div>
        {file ? (
          <><p style={{ fontSize: 18, fontWeight: 600, color: '#22C55E', marginBottom: 4 }}>Resume Uploaded!</p><p style={{ fontSize: 14, color: '#8888A0' }}>Click to change file</p></>
        ) : (
          <><p style={{ fontSize: 18, fontWeight: 600, color: '#F0F0F5', marginBottom: 4 }}>Drag & drop your resume here</p><p style={{ fontSize: 14, color: '#8888A0', marginBottom: 8 }}>or click to browse</p><p style={{ fontSize: 12, color: '#55556A' }}>Supports PDF, TXT, DOC, DOCX</p></>
        )}
      </div>

      {file && (
        <div className="file-card" style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div className="file-card-icon"><FileText size={22} color="#22C55E" /></div>
          <div className="file-card-info" style={{ flex: 1 }}><h4>{file.name}</h4><p>{formatSize(file.size)}</p></div>
          <button onClick={(e) => { e.stopPropagation(); onFileSelect(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#55556A', padding: 4 }}><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 2: TARGET SELECTOR — Role / Job Description
   ═══════════════════════════════════════════════════════════════════ */
function TargetSelector({ mode, setMode, selectedRole, onSelectRole, jobDescription, setJobDescription, jobTitle, setJobTitle }) {
  return (
    <div className="page-enter" style={{ maxWidth: 860, margin: '0 auto', padding: '48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>What Are You Targeting?</h2>
        <p style={{ fontSize: 15, color: '#8888A0', maxWidth: 500, margin: '0 auto' }}>Choose a role to analyze against, or paste a job description for custom analysis.</p>
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'role' ? 'active' : ''}`} onClick={() => setMode('role')}>
          <Target size={18} /> Select a Role
        </button>
        <button className={`mode-tab ${mode === 'jd' ? 'active' : ''}`} onClick={() => setMode('jd')}>
          <ClipboardList size={18} /> Paste Job Description
        </button>
      </div>

      {mode === 'role' && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#55556A', marginBottom: 24 }}>Select the career path you're aiming for</p>
          <div className="role-grid">
            {ROLES.map(role => {
              const Icon = role.icon;
              return (
                <div key={role.id} className={`role-card ${selectedRole === role.id ? 'selected' : ''}`} onClick={() => onSelectRole(role.id)}>
                  <div className="role-icon-wrap" style={{ background: role.gradient }}><Icon size={26} color="#fff" /></div>
                  <div className="role-title">{role.label}</div>
                  {selectedRole === role.id && <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="#fff" /></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'jd' && (
        <div style={{ animation: 'fadeInUp 0.3s ease', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8888A0', marginBottom: 8 }}>
              <Type size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Job Title (optional)
            </label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer at Google" className="jd-input" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8888A0', marginBottom: 8 }}>
              <ClipboardList size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Job Description
            </label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
              placeholder={"Paste the full job description here...\n\nInclude responsibilities, requirements, preferred qualifications, tech stack, etc. The more detail, the better the analysis."}
              className="jd-textarea" rows={10} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: jobDescription.length >= 50 ? '#4ADE80' : '#55556A' }}>
              {jobDescription.length} characters {jobDescription.length < 50 ? '(min 50)' : '✓'}
            </span>
            {jobDescription.length >= 50 && <span style={{ fontSize: 12, color: '#4F6EF7', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={14} /> Ready for analysis</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 3: LOADING SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function LoadingScreen({ isAI, targetLabel }) {
  const [idx, setIdx] = useState(0);
  const msgs = isAI ? AI_LOADING : LOCAL_LOADING;
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % msgs.length), isAI ? 2000 : 700); return () => clearInterval(t); }, [msgs, isAI]);
  return (
    <div className="loading-screen page-enter">
      <div className="loading-brain"><Brain size={44} color="#4F6EF7" /></div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Analyzing for <span style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{targetLabel}</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <span className="ai-badge" style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}>
            <Zap size={12} /> Smart Analysis Engine
          </span>
        </div>
        <div key={idx} className="loading-message">{msgs[idx]}</div>
      </div>
      <div className="loading-bar-track"><div className="loading-bar-fill" style={{ width: '100%', animation: 'loadingPulse 1.5s ease-in-out infinite' }} /></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 4: DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */
function Dashboard({ data, fileName, isAI, onStartOver }) {
  const [done, setDone] = useState({});
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const avatarColors = ['#4F6EF7', '#7C3AED', '#EC4899', '#22C55E', '#F59E0B'];

  const handleDownloadPDF = () => {
    // We use the browser's native print engine with @media print CSS.
    // This produces pixel-perfect, selectable, crisp PDFs with perfect page breaks
    // which html2canvas/html2pdf severely struggles with.
    window.print();
  };

  return (
    <div className="page-enter" style={{ padding: '40px 0 80px' }}>
      <div id="dashboard-content">
        {/* Header */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Your Career Analysis</h1>
            {isAI ? <div className="ai-badge"><Sparkles size={14} /> Analyzed by Gemini AI</div>
              : <div className="ai-badge" style={{ background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}><Zap size={14} /> Smart Local Analysis</div>}
          </div>
          <p style={{ fontSize: 14, color: '#8888A0' }}>Targeting: <strong style={{ color: '#F0F0F5' }}>{data.label}</strong> • Resume: <strong style={{ color: '#F0F0F5' }}>{fileName}</strong></p>
        </div>
        <button className="btn-secondary" onClick={onStartOver}><ArrowLeft size={16} /> Start Over</button>
      </div>

      {/* Readiness + Skills */}
      <div className="dashboard-grid">
        <div className="glass-card-static" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#8888A0', textTransform: 'uppercase', letterSpacing: 1 }}>Job Readiness Score</h3>
          <ProgressRing value={data.readinessScore} />
          <p style={{ fontSize: 14, color: '#8888A0', textAlign: 'center', maxWidth: 220 }}>Ready for <strong style={{ color: '#F0F0F5' }}>{data.label}</strong></p>
        </div>
        <div className="glass-card-static">
          <h3 className="section-title" style={{ marginBottom: 8 }}><Target size={20} color="#4F6EF7" /> Your Current Skills</h3>
          <p style={{ fontSize: 13, color: '#55556A', marginBottom: 16 }}>Detected from your resume</p>
          <div className="skill-tags">
            {data.detectedSkills.map((s, i) => <span key={i} className={`skill-tag ${s.level}`}><Zap size={12} /> {s.name}</span>)}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#55556A' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} /> Strong</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#55556A' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EAB308' }} /> Moderate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#55556A' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} /> Needs Work</div>
          </div>
        </div>
      </div>

      {/* Skill Gap */}
      <div className="glass-card-static" style={{ marginBottom: 32 }}>
        <h3 className="section-title"><AlertTriangle size={20} color="#F59E0B" /> Skill Gap Analysis</h3>
        <p className="section-subtitle">Skills you need to develop for the <strong style={{ color: '#F0F0F5' }}>{data.label}</strong> role, sorted by priority.</p>
        <div className="gap-columns">
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}><CheckCircle2 size={16} /> You Have</h4>
            {data.detectedSkills.filter(s => s.level === 'strong' || s.level === 'moderate').map((s, i) => (
              <div key={i} className="gap-card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={14} color={s.level === 'strong' ? '#22C55E' : '#EAB308'} /><span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span></div>
                <span className={`priority-badge ${s.level === 'strong' ? 'nice' : 'important'}`}>{s.level}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F87171', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}><TrendingUp size={16} /> You Need</h4>
            {data.requiredSkills.map((s, i) => (
              <div key={i} className="gap-card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CircleDot size={14} color={s.priority === 'critical' ? '#EF4444' : s.priority === 'important' ? '#F97316' : '#22C55E'} /><span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span></div>
                <span className={`priority-badge ${s.priority}`}>{s.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="roadmap-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}><GraduationCap size={20} color="#7C3AED" /> Your Learning Roadmap</h3>
          <p style={{ fontSize: 13, color: '#55556A' }}>{Object.values(done).filter(Boolean).length} / {data.roadmap.length} weeks completed</p>
        </div>
        <p className="section-subtitle">A personalized {data.roadmap.length}-week plan with free resources and hands-on projects. Scroll to explore →</p>
        <div className="roadmap-scroll">
          {data.roadmap.map((w, i) => (
            <div key={w.week} className="week-card" style={{ background: i % 2 === 0 ? 'rgba(19,19,26,0.8)' : 'rgba(22,22,31,0.8)', animationDelay: `${i * 0.08}s`, borderColor: done[w.week] ? 'rgba(34,197,94,0.3)' : undefined }}>
              <div className="week-number"><Clock size={12} /> Week {w.week}</div>
              <div className="week-title">{w.title}</div>
              <div className="week-detail"><BookOpen size={16} className="week-detail-icon" style={{ flexShrink: 0, marginTop: 2 }} /><span>{w.learn}</span></div>
              <div className="week-detail"><ExternalLink size={16} className="week-detail-icon" style={{ flexShrink: 0, marginTop: 2 }} /><span>{w.resource}</span></div>
              <div className="week-detail"><Wrench size={16} className="week-detail-icon" style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Mini Project:</strong> {w.miniProject}</span></div>
              <label className="week-checkbox">
                <input type="checkbox" checked={!!done[w.week]} onChange={() => setDone(p => ({ ...p, [w.week]: !p[w.week] }))} />
                {done[w.week] ? 'Completed!' : 'Mark as completed'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Community */}
      <div className="community-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="avatar-stack">{avatarColors.map((c, i) => <div key={i} className="avatar-dot" style={{ background: c, zIndex: 5 - i }}>{String.fromCharCode(65 + i)}</div>)}</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F5', marginBottom: 2 }}><Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{data.communityCount} students on this path</p>
            <p style={{ fontSize: 13, color: '#8888A0' }}>Currently learning: {data.communityLearning.map((item, i) => <span key={i}><strong style={{ color: '#4F6EF7' }}>{item}</strong>{i < data.communityLearning.length - 1 ? ', ' : ''}</span>)}</p>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#55556A', display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} color="#F59E0B" /> Community Spotlight</div>
      </div>
      </div>

      {/* Export */}
      <div className="export-bar">
        <RippleButton onClick={handleDownloadPDF}><Download size={18} /> Export Roadmap as PDF</RippleButton>
        <RippleButton className="btn-secondary" onClick={() => { navigator.clipboard?.writeText(`https://ai-career-nav.app/roadmap/${btoa(data.label || 'role')}`); showToast('🔗 Shareable link copied!'); }} style={{ cursor: 'pointer' }}><Copy size={16} /> Copy Shareable Link</RippleButton>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('role');
  const [selectedRole, setSelectedRole] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [isAI, setIsAI] = useState(false);

  const canProceed = analysisMode === 'role' ? !!selectedRole : jobDescription.length >= 50;
  const targetLabel = analysisMode === 'role'
    ? (ROLES.find(r => r.id === selectedRole)?.label || 'Role')
    : (jobTitle || 'Custom Job Description');

  const runAnalysis = async () => {
    if (!canProceed) return;
    setStep(3);
    setIsAI(false);

    try {
      // Extract resume text
      let resumeText = '';
      try { resumeText = await extractResumeText(file); } catch (e) { console.warn('PDF extract failed:', e); resumeText = `Resume file: ${file.name}`; }

      const target = analysisMode === 'role'
        ? (ROLES.find(r => r.id === selectedRole)?.label || selectedRole)
        : (jobTitle ? `${jobTitle}\n\n${jobDescription}` : jobDescription);

      // Try Gemini first
      if (GEMINI_API_KEY) {
        try {
          const result = await callGeminiAPI(resumeText, target, analysisMode);
          setAnalysisData(result);
          setIsAI(true);
          setStep(4);
          return;
        } catch (err) {
          console.warn('Gemini API failed, falling back to local:', err.message);
        }
      }

      // Smart local analysis — actually parses resume & JD
      const result = analyzeLocally(resumeText, target, analysisMode, selectedRole);

      // Give a moment for the loading screen to be visible
      await new Promise(r => setTimeout(r, 2000));

      setAnalysisData(result);
      setIsAI(false);
      setStep(4);

    } catch (err) {
      console.error('Analysis error:', err);
      // Absolute last resort
      const fallback = analyzeLocally('', 'Software Developer', 'role', 'swe');
      setAnalysisData(fallback);
      setIsAI(false);
      setStep(4);
    }
  };

  const startOver = () => {
    setStep(1); setFile(null); setSelectedRole(null);
    setJobDescription(''); setJobTitle('');
    setAnalysisData(null); setIsAI(false); setAnalysisMode('role');
  };

  return (
    <div className="app-container">
      <AuroraBackground />
      <StarParticles />
      <StepIndicator currentStep={step} />
      <div className="container">
        {step === 1 && (<>
          <UploadScreen file={file} onFileSelect={setFile} />
          <div style={{ textAlign: 'center', paddingBottom: 60 }}>
            <RippleButton onClick={() => file && setStep(2)} disabled={!file}>Analyze My Resume <ChevronRight size={18} /></RippleButton>
          </div>
        </>)}
        {step === 2 && (<>
          <TargetSelector mode={analysisMode} setMode={setAnalysisMode} selectedRole={selectedRole} onSelectRole={setSelectedRole} jobDescription={jobDescription} setJobDescription={setJobDescription} jobTitle={jobTitle} setJobTitle={setJobTitle} />
          <div style={{ textAlign: 'center', paddingBottom: 60, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
            <RippleButton onClick={runAnalysis} disabled={!canProceed}><Sparkles size={18} /> Generate My Roadmap</RippleButton>
          </div>
        </>)}
        {step === 3 && <LoadingScreen isAI={!!GEMINI_API_KEY} targetLabel={targetLabel} />}
        {step === 4 && analysisData && <Dashboard data={analysisData} fileName={file?.name || 'resume.pdf'} isAI={isAI} onStartOver={startOver} />}
      </div>
    </div>
  );
}
// step state: upload, target, analysis, dashboard
