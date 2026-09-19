// Dados de demonstração do site TI Sem Fronteiras.
// Em produção, substituir por chamadas a uma API real ou ao Firestore.

var PAISES = [
  { pais: "Portugal", regiao: "Europa", demanda: "Alta", custoVida: 1100, salario: 2800,
    idioma: "Português", visto: "D3 (Trabalho Altamente Qualificado) / Blue Card UE", dificuldadeVisto: "Baixa",
    resumo: "Idioma nativo facilita a adaptação. Forte polo de startups em Lisboa e Porto, com custo de vida menor que a média da Europa Ocidental.",
    bandeira: "🇵🇹" },
  { pais: "Alemanha", regiao: "Europa", demanda: "Muito Alta", custoVida: 1500, salario: 4800,
    idioma: "Alemão / Inglês (setor de tech)", visto: "Blue Card UE / Visto de Busca de Emprego", dificuldadeVisto: "Média",
    resumo: "Maior mercado de TI da Europa. Muitas empresas aceitam inglês como língua de trabalho.",
    bandeira: "🇩🇪" },
  { pais: "Canadá", regiao: "América do Norte", demanda: "Muito Alta", custoVida: 1800, salario: 5200,
    idioma: "Inglês / Francês", visto: "Express Entry (Federal Skilled Worker)", dificuldadeVisto: "Média",
    resumo: "Programa de imigração por pontos bem estruturado, favorável a profissionais de TI.",
    bandeira: "🇨🇦" },
  { pais: "Irlanda", regiao: "Europa", demanda: "Alta", custoVida: 1900, salario: 5000,
    idioma: "Inglês", visto: "Critical Skills Employment Permit", dificuldadeVisto: "Baixa",
    resumo: "Sede europeia de muitas big techs (Google, Meta, Stripe). Custo de vida alto em Dublin.",
    bandeira: "🇮🇪" },
  { pais: "Espanha", regiao: "Europa", demanda: "Média", custoVida: 1200, salario: 2600,
    idioma: "Espanhol", visto: "Visto de Empreendedor / Trabalho Altamente Qualificado", dificuldadeVisto: "Baixa",
    resumo: "Boa qualidade de vida e proximidade cultural com o Brasil, salários mais baixos que a média da UE.",
    bandeira: "🇪🇸" },
  { pais: "Emirados Árabes Unidos", regiao: "Oriente Médio", demanda: "Alta", custoVida: 2200, salario: 5500,
    idioma: "Inglês", visto: "Golden Visa / Visto de Trabalho patrocinado por empresa", dificuldadeVisto: "Baixa",
    resumo: "Isenção de imposto de renda pessoal. Alta demanda por especialistas em cloud e segurança.",
    bandeira: "🇦🇪" },
];

var VAGAS = [
  { titulo: "Backend Developer (Node.js)", empresa: "TechNordic", pais: "Portugal",
    modalidade: "Remoto", senioridade: "Pleno", stack: ["Node.js", "TypeScript", "AWS"], salario: "2800–3600" },
  { titulo: "Suporte de Infraestrutura TI", empresa: "BlueCloud GmbH", pais: "Alemanha",
    modalidade: "Híbrido", senioridade: "Júnior", stack: ["Linux", "Redes", "ITIL"], salario: "3200–4000" },
  { titulo: "DevOps Engineer", empresa: "MapleStack", pais: "Canadá",
    modalidade: "Remoto", senioridade: "Sênior", stack: ["Kubernetes", "Terraform", "AWS"], salario: "6000–8000" },
  { titulo: "Suporte Técnico N2", empresa: "GreenIsle IT", pais: "Irlanda",
    modalidade: "Presencial", senioridade: "Júnior", stack: ["Windows Server", "Active Directory"], salario: "3400–4200" },
  { titulo: "QA Automation Engineer", empresa: "IberiaSoft", pais: "Espanha",
    modalidade: "Remoto", senioridade: "Pleno", stack: ["Python", "Selenium", "CI/CD"], salario: "2400–3200" },
  { titulo: "Cloud Security Analyst", empresa: "DesertSec", pais: "Emirados Árabes Unidos",
    modalidade: "Presencial", senioridade: "Sênior", stack: ["Azure", "SIEM", "ISO 27001"], salario: "5500–7000" },
];

var RADAR_TECNOLOGIAS = [
  { tecnologia: "Python", categoria: "Linguagem", demanda: 92 },
  { tecnologia: "JavaScript / TypeScript", categoria: "Linguagem", demanda: 88 },
  { tecnologia: "AWS", categoria: "Cloud", demanda: 85 },
  { tecnologia: "Docker / Kubernetes", categoria: "DevOps", demanda: 80 },
  { tecnologia: "Linux (Suporte/Admin)", categoria: "Infraestrutura", demanda: 78 },
  { tecnologia: "SQL", categoria: "Dados", demanda: 75 },
  { tecnologia: "Active Directory", categoria: "Infraestrutura", demanda: 60 },
  { tecnologia: "Terraform", categoria: "DevOps", demanda: 55 },
];

var TRILHAS_QUALIFICACAO = [
  { area: "Suporte / Redes", competencia: "Redes e Infraestrutura",
    certificacoes: ["CompTIA Network+", "CCNA", "ITIL Foundation"] },
  { area: "Cloud", competencia: "Computação em Nuvem",
    certificacoes: ["AWS Cloud Practitioner", "AWS Solutions Architect Associate", "Azure Fundamentals (AZ-900)"] },
  { area: "Segurança", competencia: "Cibersegurança",
    certificacoes: ["CompTIA Security+", "ISO 27001 Foundation"] },
  { area: "Desenvolvimento", competencia: "Programação Backend",
    certificacoes: ["Python Institute PCEP", "freeCodeCamp Backend", "Node.js Certification"] },
  { area: "DevOps", competencia: "Automação e Deploy",
    certificacoes: ["Docker Certified Associate", "Certified Kubernetes Administrator (CKA)"] },
];
