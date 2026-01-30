import { useEffect, useState } from 'react'
import {
  Terminal,
  Activity,
  Code,
  ClipboardList,
  Check,
  ArrowRight,
  Quote,
} from 'lucide-react'

// Types
interface CTAButton {
  text: string
  url: string
}

interface PainPoint {
  title: string
  description: string
}

interface Benefit {
  title: string
  description: string
}

interface Step {
  number: number
  title: string
  description: string
  code?: string
  time?: string
}

interface Stat {
  metric: string
  label: string
  description: string
}

interface Spec {
  value: string
  label: string
}

interface ContentData {
  hero: {
    headline: string
    subheadline: string
    description: string
    cta_primary: CTAButton
    cta_secondary: CTAButton
  }
  problem_section: {
    eyebrow: string
    title: string
    description: string
    pain_points: PainPoint[]
  }
  solution_section: {
    eyebrow: string
    title: string
    description: string
    benefits: Benefit[]
  }
  how_it_works: {
    title: string
    steps: Step[]
  }
  proof: {
    title: string
    stats: Stat[]
  }
  testimonial: {
    quote: string
    author: string
    company: string
    metric: string
    metric_label: string
  }
  tech_specs: {
    title: string
    specs: Spec[]
  }
  final_cta: {
    title: string
    description: string
    cta_primary: CTAButton
    cta_secondary: CTAButton
  }
}

// Default content
const defaultContent: ContentData = {
  hero: {
    headline: "Stop agent sprawl.",
    subheadline: "Control data at the source.",
    description: "Replace dozens of single-purpose agents with one unified platform. Deploy to any infrastructure with policy-driven pipelines that self-heal - so you can build instead of maintain.",
    cta_primary: { text: "Start Free Trial", url: "https://exso.cloud/get-started" },
    cta_secondary: { text: "See How It Works", url: "#how-it-works" }
  },
  problem_section: {
    eyebrow: "The Problem",
    title: "Your infrastructure is buried in agents.",
    description: "Every tool brings its own agent. Every team writes custom scripts. You spend your nights fixing pipelines instead of shipping features.",
    pain_points: [
      { title: "Splunk forwarders everywhere", description: "One per node, custom configs, constant updates" },
      { title: "Fluentd for Kubernetes logs", description: "YAML nightmares, version drift, debugging hell" },
      { title: "Custom scripts for compliance", description: "Brittle Python, unknown authors, 2 AM pages" },
      { title: "Manual policy enforcement", description: "Tickets, approvals, meetings - just to move data" }
    ]
  },
  solution_section: {
    eyebrow: "The Solution",
    title: "One agent. Everywhere.",
    description: "Expanso Edge replaces your patchwork of tools with a single, policy-driven platform. Deploy to cloud, on-prem, edge, or Kubernetes - one agent, one config, total visibility.",
    benefits: [
      { title: "One Agent Replaces Many", description: "Splunk forwarders, Fluentd, Vector, custom scripts - all replaced by one lightweight agent." },
      { title: "Policy-Driven, Not Code-Heavy", description: "Declarative YAML configs that version in Git. No more brittle scripts." },
      { title: "Built-In Governance", description: "Audit trails, data lineage, and compliance enforcement - automatic from day one." },
      { title: "Self-Healing Pipelines", description: "Automatic retries, intelligent backpressure, no data loss. Sleep through the night." }
    ]
  },
  how_it_works: {
    title: "From chaos to control in minutes",
    steps: [
      { number: 1, title: "Deploy the Agent", description: "One command installs Expanso Edge anywhere - cloud VMs, Kubernetes, edge devices, or on-prem servers.", code: "curl -fsSL https://get.expanso.io/edge/install.sh | bash\nexpanso-edge bootstrap --token YOUR_TOKEN", time: "< 2 minutes" },
      { number: 2, title: "Define Your Pipeline", description: "Write pipelines as code. Transform data with Bloblang, filter noise, route to any destination - all version-controlled in Git.", code: "input:\n  file:\n    paths: [\"/var/log/app/*.log\"]\npipeline:\n  processors:\n    - mapping: |\n        root = if this.level == \"ERROR\" { this }\n        else { deleted() }\noutput:\n  aws_s3:\n    bucket: processed-logs\n    path: logs/${!timestamp_unix()}.json", time: "5 minutes" },
      { number: 3, title: "Watch Data Flow", description: "See filtered, governed data arrive at S3, Snowflake, Kafka, or any destination - with full audit trails.", time: "Real-time" }
    ]
  },
  proof: {
    title: "What changes when you stop the sprawl",
    stats: [
      { metric: "70%", label: "Less maintenance", description: "One agent to update, one config to manage" },
      { metric: "50-70%", label: "Lower data costs", description: "Filter at source, pay for less downstream" },
      { metric: "Minutes", label: "To deploy", description: "Not weeks of scripting and testing" }
    ]
  },
  testimonial: {
    quote: "We replaced six different agents with Expanso. My team went from spending 40% of their time on pipeline maintenance to building actual features.",
    author: "Senior Platform Engineer",
    company: "Fortune 500 Retailer",
    metric: "40% -> 5%",
    metric_label: "Time on maintenance"
  },
  tech_specs: {
    title: "Built for scale",
    specs: [
      { value: "10,000+", label: "Nodes per cluster" },
      { value: "< 30 seconds", label: "Config propagation" },
      { value: "200+", label: "Connectors" },
      { value: "99.9%", label: "Uptime SLA" }
    ]
  },
  final_cta: {
    title: "Ready to stop maintaining and start building?",
    description: "Start free. Deploy in minutes. No credit card required.",
    cta_primary: { text: "Start Free Trial", url: "https://exso.cloud/get-started" },
    cta_secondary: { text: "Talk to an Engineer", url: "/book-a-demo" }
  }
}

// Button Component
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  href?: string
  className?: string
}

const Button = ({ children, variant = 'primary', href, className = '' }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-[#F59E0B] text-black hover:bg-[#D97706] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    ghost: 'bg-transparent border border-[#1E1E26] text-gray-300 hover:border-[#7C3AED] hover:text-white',
  }

  const classes = `${baseStyles} ${variants[variant]} ${className}`

  if (href) {
    return <a href={href} className={classes}>{children}</a>
  }
  return <button className={classes}>{children}</button>
}

// Terminal Animation Component
const TerminalBlock = () => {
  const [lines, setLines] = useState<Array<string | { text: string; type?: string }>>(['# Current data agents on this host:', ''])

  useEffect(() => {
    const sequence = [
      { text: 'splunk-forwarder    x12 nodes', delay: 500 },
      { text: 'fluentd-k8s         x8 pods', delay: 700 },
      { text: 'vector-edge         x23 hosts', delay: 900 },
      { text: 'custom-etl.py       x6 crons', delay: 1100 },
      { text: 'filebeat            x15 hosts', delay: 1300 },
      { text: 'logstash            x9 containers', delay: 1500 },
      { text: '', delay: 1700 },
      { text: '# Total: 115 agents, 4 teams maintaining', type: 'error', delay: 1900 },
      { text: '', delay: 2300 },
      { text: '# Replace with Expanso Edge:', delay: 2600 },
      { text: '$ curl -fsSL https://get.expanso.io/edge/install.sh | bash', type: 'command', delay: 3000 },
      { text: 'Installing expanso-edge v1.2.0...', delay: 3400 },
      { text: 'expanso-edge installed', type: 'success', delay: 3800 },
      { text: '$ expanso-edge bootstrap --token $TOKEN', type: 'command', delay: 4200 },
      { text: 'Node registered. Ready for pipelines.', type: 'success', delay: 4600 },
    ]

    const timers = sequence.map(({ text, delay, type }) => {
      return setTimeout(() => {
        setLines(prev => [...prev, { text, type }])
      }, delay)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="w-full bg-[#050508] border border-[#1E1E26] font-mono text-sm shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E1E26] bg-[#0A0A0F]">
        <div className="w-3 h-3 bg-[#FF5F56]"></div>
        <div className="w-3 h-3 bg-[#FFBD2E]"></div>
        <div className="w-3 h-3 bg-[#27C93F]"></div>
        <span className="ml-4 text-xs text-[#6B7280]">~/infrastructure</span>
      </div>
      <div className="p-4 h-72 overflow-hidden">
        {lines.map((line, i) => {
          if (typeof line === 'string') return <div key={i} className="text-gray-400">{line}</div>
          const colors: Record<string, string> = {
            error: 'text-red-400',
            success: 'text-[#10B981]',
            command: 'text-[#F59E0B]',
          }
          return (
            <div key={i} className={colors[line.type || ''] || 'text-gray-400'}>
              {line.type === 'success' && <span className="text-[#10B981] mr-1">+</span>}
              {line.text}
            </div>
          )
        })}
        <span className="inline-block w-2 h-4 bg-[#7C3AED] animate-pulse"></span>
      </div>
    </div>
  )
}

// Problem Card Component
interface ProblemCardProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  title: string
  description: string
  num: number
}

const ProblemCard = ({ icon: Icon, title, description, num }: ProblemCardProps) => (
  <div className="group p-6 bg-[#0A0A0F] border border-[#1E1E26] hover:border-[#7C3AED] transition-colors">
    <div className="text-xs text-[#6B7280] font-mono mb-4">0{num}</div>
    <div className="mb-4 text-[#7C3AED]">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-[#9CA3AF] text-sm leading-relaxed">{description}</p>
  </div>
)

// Benefit Item Component
interface BenefitItemProps {
  title: string
  description: string
}

const BenefitItem = ({ title, description }: BenefitItemProps) => (
  <div className="flex gap-4 p-4 bg-[#0A0A0F] border border-[#1E1E26]">
    <div className="shrink-0">
      <div className="w-6 h-6 bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
        <Check size={14} className="text-[#7C3AED]" />
      </div>
    </div>
    <div>
      <strong className="text-white block mb-1">{title}</strong>
      <span className="text-[#9CA3AF] text-sm">{description}</span>
    </div>
  </div>
)

// Step Component
interface StepProps {
  number: number
  title: string
  description: string
  code?: string
  time?: string
}

const StepBlock = ({ number, title, description, code, time }: StepProps) => (
  <div className="flex gap-8 py-8 border-b border-[#1E1E26] last:border-b-0">
    <div className="shrink-0 w-24 text-right">
      <div className="text-4xl font-bold text-[#7C3AED]">{number}</div>
      {time && <div className="text-xs text-[#10B981] font-mono mt-2">{time}</div>}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-[#9CA3AF] mb-4">{description}</p>
      {code && (
        <div className="bg-[#0A0A0F] border border-[#1E1E26] p-4 font-mono text-sm">
          <pre className="text-[#06B6D4] whitespace-pre-wrap">{code}</pre>
        </div>
      )}
    </div>
  </div>
)

// Stat Card Component
interface StatCardProps {
  metric: string
  label: string
  description: string
}

const StatCard = ({ metric, label, description }: StatCardProps) => (
  <div className="text-center p-8 border border-[#1E1E26]">
    <div className="text-5xl font-bold text-[#7C3AED] mb-2">{metric}</div>
    <div className="text-white font-semibold mb-1">{label}</div>
    <p className="text-[#9CA3AF] text-sm">{description}</p>
  </div>
)

// Main Component
interface StopAgentSprawlReactProps {
  content?: Partial<ContentData>
}

export default function StopAgentSprawlReact({ content }: StopAgentSprawlReactProps) {
  const data = { ...defaultContent, ...content }

  const problemIcons = [Activity, Terminal, Code, ClipboardList]

  return (
    <div className="bg-[#0A0A0F] text-[#F9FAFB] min-h-screen">

      {/* HERO */}
      <section className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E1E26_1px,transparent_1px),linear-gradient(to_bottom,#1E1E26_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              {data.hero.headline}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                {data.hero.subheadline}
              </span>
            </h1>

            <p className="text-xl text-[#9CA3AF] max-w-lg leading-relaxed">
              {data.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" href={data.hero.cta_primary.url}>
                {data.hero.cta_primary.text}
                <ArrowRight size={18} />
              </Button>
              <Button variant="ghost" href={data.hero.cta_secondary.url}>
                {data.hero.cta_secondary.text}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-[#7C3AED]/10 blur-3xl -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#F59E0B]/10 blur-3xl -z-10"></div>
            <TerminalBlock />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#141419] border-y border-[#1E1E26]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-[#EF4444] text-xs font-mono uppercase tracking-wider">
              {data.problem_section.eyebrow}
            </span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-6">
              {data.problem_section.title}
            </h2>
            <p className="text-xl text-[#9CA3AF]">
              {data.problem_section.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.problem_section.pain_points.map((point, i) => (
              <ProblemCard
                key={i}
                num={i + 1}
                icon={problemIcons[i % problemIcons.length]}
                title={point.title}
                description={point.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-[#10B981] text-xs font-mono uppercase tracking-wider">
              {data.solution_section.eyebrow}
            </span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-6">
              {data.solution_section.title}
            </h2>
            <p className="text-xl text-[#9CA3AF]">
              {data.solution_section.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {data.solution_section.benefits.map((benefit, i) => (
              <BenefitItem key={i} title={benefit.title} description={benefit.description} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#141419]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            {data.how_it_works.title}
          </h2>

          <div>
            {data.how_it_works.steps.map((step, i) => (
              <StepBlock key={i} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            {data.proof.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {data.proof.stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#141419] border-y border-[#1E1E26]">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-8 text-[#7C3AED]/30" />
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 text-white">
            "{data.testimonial.quote}"
          </blockquote>
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              <span className="text-2xl font-bold text-[#7C3AED]">{data.testimonial.metric}</span>
              <span className="text-[#9CA3AF]">{data.testimonial.metric_label}</span>
            </div>
            <div className="text-[#9CA3AF]">
              <span className="font-medium text-white">{data.testimonial.author}</span>
              <span className="mx-2">-</span>
              <span>{data.testimonial.company}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TECH SPECS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#1E1E26]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-8">
            {data.tech_specs.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {data.tech_specs.specs.map((spec, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{spec.value}</div>
                <div className="text-sm text-[#6B7280]">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            {data.final_cta.title}
          </h2>
          <p className="text-xl text-[#9CA3AF] mb-10">
            {data.final_cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href={data.final_cta.cta_primary.url}>
              {data.final_cta.cta_primary.text}
              <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" href={data.final_cta.cta_secondary.url}>
              {data.final_cta.cta_secondary.text}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
