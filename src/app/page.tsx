"use client"

import { useState, useEffect } from "react"
import { Activity, Target, TrendingUp, Users, Camera, Dumbbell, Home, Trophy, MessageCircle, Share2, Heart, Zap, Award, Upload, Scale, Ruler, Calendar, ChevronRight, CheckCircle2, Play, Info, Star, BarChart3, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Goal = "weight-loss" | "weight-gain" | "endurance" | null
type Level = "beginner" | "intermediate" | "advanced" | null
type Location = "gym" | "home" | null
type Plan = "essential" | "premium" | null
type ActivityLevel = "sedentary" | "light" | "moderate" | "very-active" | "extra-active" | null

interface BiometricData {
  age: number | null
  weight: number | null
  height: number | null
  gender: "male" | "female" | null
  activityLevel: ActivityLevel
  photoUrl: string | null
  bmi: number | null
  bmiCategory: string | null
}

interface UserProfile {
  name: string
  goal: Goal
  level: Level
  location: Location
  plan: Plan
  completedWorkouts: number
  biometrics: BiometricData
}

interface CommunityPost {
  id: string
  user: string
  goal: string
  result: string
  likes: number
  date: string
}

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  equipment?: string
  instructions: string
}

interface MealPlan {
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  snacks: string[]
}

export default function FitnessApp() {
  const [step, setStep] = useState(-1) // -1 = Landing Page
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    goal: null,
    level: null,
    location: null,
    plan: null,
    completedWorkouts: 0,
    biometrics: {
      age: null,
      weight: null,
      height: null,
      gender: null,
      activityLevel: null,
      photoUrl: null,
      bmi: null,
      bmiCategory: null
    }
  })
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [newPost, setNewPost] = useState("")
  const [tempBiometrics, setTempBiometrics] = useState({
    age: "",
    weight: "",
    height: "",
    gender: null as "male" | "female" | null
  })

  // Load data from localStorage with error handling
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("fitnessProfile")
      const savedPosts = localStorage.getItem("communityPosts")
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        setProfile(parsed)
        setStep(parsed.name ? 8 : -1)
      }
      
      if (savedPosts) {
        setCommunityPosts(JSON.parse(savedPosts))
      } else {
        // Initial community posts
        setCommunityPosts([
          {
            id: "1",
            user: "Carlos Silva",
            goal: "Emagrecimento",
            result: "Perdi 8kg em 2 meses seguindo o plano! Minha performance melhorou muito! 💪",
            likes: 24,
            date: "2 dias atrás"
          },
          {
            id: "2",
            user: "Ana Costa",
            goal: "Resistência",
            result: "Consegui correr 10km sem parar! O treino de resistência é incrível! 🏃‍♀️",
            likes: 18,
            date: "5 dias atrás"
          },
          {
            id: "3",
            user: "Pedro Santos",
            goal: "Ganho de Peso",
            result: "Ganhei 5kg de massa muscular! Agora sou muito mais forte! 💪",
            likes: 31,
            date: "1 semana atrás"
          }
        ])
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error)
      // Continue with default values if localStorage fails
    }
  }, [])

  // Save profile to localStorage with error handling
  useEffect(() => {
    if (profile.name) {
      try {
        localStorage.setItem("fitnessProfile", JSON.stringify(profile))
      } catch (error) {
        console.error("Erro ao salvar perfil:", error)
      }
    }
  }, [profile])

  // Save posts to localStorage with error handling
  useEffect(() => {
    if (communityPosts.length > 0) {
      try {
        localStorage.setItem("communityPosts", JSON.stringify(communityPosts))
      } catch (error) {
        console.error("Erro ao salvar posts:", error)
      }
    }
  }, [communityPosts])

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return Math.round(bmi * 10) / 10
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Abaixo do peso"
    if (bmi < 25) return "Peso normal"
    if (bmi < 30) return "Sobrepeso"
    return "Obesidade"
  }

  const handleNameSubmit = (name: string) => {
    if (name.trim()) {
      setProfile({ ...profile, name: name.trim() })
      setStep(1)
    }
  }

  const handleGoalSelect = (goal: Goal) => {
    setProfile({ ...profile, goal })
    setStep(2)
  }

  const handleBiometricsSubmit = () => {
    const age = parseInt(tempBiometrics.age)
    const weight = parseFloat(tempBiometrics.weight)
    const height = parseFloat(tempBiometrics.height)
    const gender = tempBiometrics.gender

    if (!age || !weight || !height || !gender || age < 15 || age > 100 || weight < 30 || weight > 300 || height < 100 || height > 250) {
      return
    }

    const bmi = calculateBMI(weight, height)
    const bmiCategory = getBMICategory(bmi)

    setProfile({
      ...profile,
      biometrics: {
        ...profile.biometrics,
        age,
        weight,
        height,
        gender,
        bmi,
        bmiCategory
      }
    })
    setStep(3)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({
          ...profile,
          biometrics: {
            ...profile.biometrics,
            photoUrl: reader.result as string
          }
        })
      }
      reader.onerror = () => {
        console.error("Erro ao carregar imagem")
        alert('Erro ao carregar a imagem. Tente novamente.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleActivityLevelSelect = (activityLevel: ActivityLevel) => {
    setProfile({
      ...profile,
      biometrics: {
        ...profile.biometrics,
        activityLevel
      }
    })
    setStep(4)
  }

  const handleLevelSelect = (level: Level) => {
    setProfile({ ...profile, level })
    setStep(5)
  }

  const handleLocationSelect = (location: Location) => {
    setProfile({ ...profile, location })
    setStep(6)
  }

  const handlePlanChoice = (plan: Plan) => {
    setProfile({ ...profile, plan })
    setStep(7)
  }

  const completeWorkout = () => {
    setProfile({ ...profile, completedWorkouts: profile.completedWorkouts + 1 })
  }

  const handleLike = (postId: string) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    )
  }

  const handleShare = () => {
    if (!newPost.trim()) return
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      user: profile.name,
      goal: profile.goal === "weight-loss" ? "Emagrecimento" : profile.goal === "weight-gain" ? "Ganho de Peso" : "Resistência",
      result: newPost,
      likes: 0,
      date: "Agora"
    }
    
    setCommunityPosts([post, ...communityPosts])
    setNewPost("")
  }

  const resetProfile = () => {
    try {
      localStorage.removeItem("fitnessProfile")
    } catch (error) {
      console.error("Erro ao limpar localStorage:", error)
    }
    
    setProfile({
      name: "",
      goal: null,
      level: null,
      location: null,
      plan: null,
      completedWorkouts: 0,
      biometrics: {
        age: null,
        weight: null,
        height: null,
        gender: null,
        activityLevel: null,
        photoUrl: null,
        bmi: null,
        bmiCategory: null
      }
    })
    setTempBiometrics({
      age: "",
      weight: "",
      height: "",
      gender: null
    })
    setStep(-1)
  }

  const getMealPlan = (): MealPlan => {
    const plans = {
      "weight-loss": {
        breakfast: [
          "🥚 Omelete com 3 claras + 1 gema, espinafre e tomate",
          "🥛 Iogurte grego natural com frutas vermelhas",
          "☕ Café preto ou chá verde sem açúcar"
        ],
        lunch: [
          "🍗 Peito de frango grelhado (150g)",
          "🥗 Salada verde variada com azeite",
          "🍚 Arroz integral (3 colheres de sopa)",
          "🥦 Brócolis no vapor"
        ],
        dinner: [
          "🐟 Salmão grelhado (120g)",
          "🥔 Batata doce assada (100g)",
          "🥗 Salada de folhas verdes",
          "🥒 Pepino e tomate"
        ],
        snacks: [
          "🍎 1 maçã com pasta de amendoim (1 colher)",
          "🥜 Mix de castanhas (30g)",
          "🥤 Whey protein com água"
        ]
      },
      "weight-gain": {
        breakfast: [
          "🥞 Panqueca de aveia com banana e mel",
          "🥚 3 ovos mexidos com queijo",
          "🥛 Vitamina de frutas com aveia",
          "🍞 2 fatias de pão integral com pasta de amendoim"
        ],
        lunch: [
          "🍖 Carne vermelha magra (200g)",
          "🍚 Arroz integral (1 xícara)",
          "🫘 Feijão (1 concha)",
          "🥔 Batata doce (150g)",
          "🥗 Salada variada com azeite"
        ],
        dinner: [
          "🍗 Frango grelhado (200g)",
          "🍝 Macarrão integral (1 xícara)",
          "🥦 Brócolis e couve-flor",
          "🥑 Abacate (1/2 unidade)"
        ],
        snacks: [
          "🥤 Shake hipercalórico (whey + banana + aveia + pasta de amendoim)",
          "🥜 Mix de castanhas e frutas secas (50g)",
          "🍞 Sanduíche natural com frango e queijo",
          "🥛 Iogurte integral com granola"
        ]
      },
      "endurance": {
        breakfast: [
          "🥣 Aveia com banana, mel e canela",
          "🥚 2 ovos cozidos",
          "🍊 Suco de laranja natural",
          "🍞 Torrada integral com geleia"
        ],
        lunch: [
          "🍗 Peito de frango (150g)",
          "🍚 Arroz integral (1 xícara)",
          "🫘 Feijão ou lentilha",
          "🥗 Salada colorida",
          "🥔 Batata doce (100g)"
        ],
        dinner: [
          "🐟 Peixe grelhado (150g)",
          "🍝 Quinoa ou macarrão integral",
          "🥦 Legumes variados no vapor",
          "🥗 Salada verde"
        ],
        snacks: [
          "🍌 Banana com aveia",
          "🥤 Isotônico natural",
          "🍪 Barra de cereais integral",
          "🥜 Castanhas e frutas secas"
        ]
      }
    }

    return profile.goal ? plans[profile.goal] : plans["endurance"]
  }

  const getWorkoutPlan = () => {
    const isGym = profile.location === "gym"
    
    const plans = {
      "weight-loss": {
        title: "Plano de Emagrecimento",
        description: "Queime calorias e melhore sua velocidade",
        workouts: isGym ? [
          { 
            name: "HIIT na Esteira", 
            duration: "30 min", 
            calories: "450 kcal", 
            icon: Zap,
            exercises: [
              { name: "Aquecimento na Esteira", sets: "1", reps: "5 min", rest: "-", equipment: "Esteira", instructions: "Velocidade moderada 6-7 km/h" },
              { name: "Sprint na Esteira", sets: "8", reps: "30 seg", rest: "30 seg", equipment: "Esteira", instructions: "Velocidade máxima 12-15 km/h, intercalando com caminhada" },
              { name: "Burpees", sets: "3", reps: "15", rest: "45 seg", equipment: "Peso corporal", instructions: "Movimento explosivo completo" },
              { name: "Mountain Climbers", sets: "3", reps: "20", rest: "30 seg", equipment: "Peso corporal", instructions: "Ritmo acelerado, core contraído" },
              { name: "Bike Ergométrica", sets: "1", reps: "10 min", rest: "-", equipment: "Bike", instructions: "Resistência alta, ritmo constante" }
            ]
          },
          { 
            name: "Treino de Peito (Leve)", 
            duration: "35 min", 
            calories: "320 kcal", 
            icon: Dumbbell,
            exercises: [
              { name: "Supino Reto com Halteres", sets: "3", reps: "15", rest: "60 seg", equipment: "Halteres", instructions: "Peso leve/moderado, foco na queima calórica" },
              { name: "Crucifixo Inclinado", sets: "3", reps: "15", rest: "45 seg", equipment: "Halteres", instructions: "Movimento controlado, amplitude completa" },
              { name: "Flexão de Braço", sets: "3", reps: "12-15", rest: "45 seg", equipment: "Peso corporal", instructions: "Ritmo constante, manter core ativado" },
              { name: "Pullover com Halter", sets: "3", reps: "15", rest: "45 seg", equipment: "Halter", instructions: "Alongamento do peitoral" }
            ]
          },
          { 
            name: "Treino de Costas (Leve)", 
            duration: "35 min", 
            calories: "310 kcal", 
            icon: Activity,
            exercises: [
              { name: "Remada na Polia", sets: "3", reps: "15", rest: "60 seg", equipment: "Polia", instructions: "Peso moderado, contrair escápulas" },
              { name: "Pulldown Frontal", sets: "3", reps: "15", rest: "45 seg", equipment: "Polia Alta", instructions: "Puxar até o peito, movimento controlado" },
              { name: "Remada Curvada com Halteres", sets: "3", reps: "12", rest: "45 seg", equipment: "Halteres", instructions: "Costas retas, puxar cotovelos para trás" },
              { name: "Hiperextensão Lombar", sets: "3", reps: "15", rest: "45 seg", equipment: "Banco Romano", instructions: "Fortalecer lombar, movimento controlado" }
            ]
          },
          { 
            name: "Treino de Braços (Leve)", 
            duration: "30 min", 
            calories: "280 kcal", 
            icon: Target,
            exercises: [
              { name: "Rosca Direta com Barra", sets: "3", reps: "15", rest: "45 seg", equipment: "Barra", instructions: "Peso leve, foco na contração" },
              { name: "Tríceps na Polia", sets: "3", reps: "15", rest: "45 seg", equipment: "Polia", instructions: "Cotovelos fixos, extensão completa" },
              { name: "Rosca Martelo", sets: "3", reps: "12", rest: "45 seg", equipment: "Halteres", instructions: "Movimento alternado, controlar descida" },
              { name: "Tríceps Testa", sets: "3", reps: "12", rest: "45 seg", equipment: "Barra W", instructions: "Cotovelos fixos, descer controlado" }
            ]
          },
          { 
            name: "Treino de Pernas (Leve)", 
            duration: "40 min", 
            calories: "380 kcal", 
            icon: Trophy,
            exercises: [
              { name: "Agachamento no Smith", sets: "3", reps: "15", rest: "60 seg", equipment: "Smith Machine", instructions: "Peso moderado, descer até 90°" },
              { name: "Leg Press 45°", sets: "3", reps: "15", rest: "60 seg", equipment: "Leg Press", instructions: "Amplitude completa, não travar joelhos" },
              { name: "Cadeira Extensora", sets: "3", reps: "15", rest: "45 seg", equipment: "Máquina Extensora", instructions: "Contrair quadríceps no topo" },
              { name: "Mesa Flexora", sets: "3", reps: "15", rest: "45 seg", equipment: "Máquina Flexora", instructions: "Trabalhar posteriores de coxa" },
              { name: "Panturrilha em Pé", sets: "3", reps: "20", rest: "45 seg", equipment: "Máquina de Panturrilha", instructions: "Amplitude máxima" }
            ]
          }
        ] : [
          { name: "HIIT Cardio", duration: "30 min", calories: "400 kcal", icon: Zap, exercises: [] },
          { name: "Corrida Intervalada", duration: "45 min", calories: "500 kcal", icon: Activity, exercises: [] },
          { name: "Treino Funcional", duration: "40 min", calories: "350 kcal", icon: Target, exercises: [] },
          { name: "Treino de Agilidade", duration: "30 min", calories: "300 kcal", icon: Trophy, exercises: [] }
        ]
      },
      "weight-gain": {
        title: "Plano de Ganho de Peso",
        description: "Construa massa muscular e aumente sua força",
        workouts: isGym ? [
          { 
            name: "Treino de Peito e Tríceps", 
            duration: "60 min", 
            calories: "450 kcal", 
            icon: Dumbbell,
            exercises: [
              { name: "Supino Reto com Barra", sets: "4", reps: "8-10", rest: "90 seg", equipment: "Barra + Banco", instructions: "Descer até o peito, subir explosivo" },
              { name: "Supino Inclinado com Halteres", sets: "4", reps: "10-12", rest: "75 seg", equipment: "Halteres + Banco Inclinado", instructions: "Ângulo 45°, amplitude completa" },
              { name: "Crucifixo na Polia", sets: "3", reps: "12-15", rest: "60 seg", equipment: "Polia Crossover", instructions: "Braços levemente flexionados, contrair no centro" },
              { name: "Tríceps Testa com Barra W", sets: "4", reps: "10-12", rest: "60 seg", equipment: "Barra W", instructions: "Cotovelos fixos, descer até a testa" },
              { name: "Tríceps na Polia", sets: "3", reps: "12-15", rest: "45 seg", equipment: "Polia + Corda", instructions: "Cotovelos junto ao corpo, extensão completa" }
            ]
          },
          { 
            name: "Treino de Costas e Bíceps", 
            duration: "60 min", 
            calories: "470 kcal", 
            icon: TrendingUp,
            exercises: [
              { name: "Barra Fixa", sets: "4", reps: "8-12", rest: "90 seg", equipment: "Barra Fixa", instructions: "Pegada pronada, puxar até o queixo" },
              { name: "Remada Curvada com Barra", sets: "4", reps: "10-12", rest: "75 seg", equipment: "Barra", instructions: "Costas retas, puxar até o abdômen" },
              { name: "Pulldown na Polia", sets: "4", reps: "12-15", rest: "60 seg", equipment: "Polia Alta", instructions: "Puxar até o peito, contrair escápulas" },
              { name: "Rosca Direta com Barra", sets: "4", reps: "10-12", rest: "60 seg", equipment: "Barra", instructions: "Cotovelos fixos, contrair bíceps no topo" },
              { name: "Rosca Martelo com Halteres", sets: "3", reps: "12-15", rest: "45 seg", equipment: "Halteres", instructions: "Pegada neutra, movimento alternado" }
            ]
          },
          { 
            name: "Treino de Pernas", 
            duration: "65 min", 
            calories: "520 kcal", 
            icon: Zap,
            exercises: [
              { name: "Agachamento Livre", sets: "5", reps: "8-10", rest: "120 seg", equipment: "Barra + Rack", instructions: "Descer até paralelo, subir explosivo" },
              { name: "Leg Press 45°", sets: "4", reps: "12-15", rest: "90 seg", equipment: "Leg Press", instructions: "Descer até 90°, empurrar com força" },
              { name: "Cadeira Extensora", sets: "4", reps: "12-15", rest: "60 seg", equipment: "Máquina Extensora", instructions: "Extensão completa, contrair quadríceps" },
              { name: "Mesa Flexora", sets: "4", reps: "12-15", rest: "60 seg", equipment: "Máquina Flexora", instructions: "Flexão completa, contrair posteriores" },
              { name: "Panturrilha no Smith", sets: "4", reps: "15-20", rest: "45 seg", equipment: "Smith Machine", instructions: "Amplitude máxima, pico de contração" }
            ]
          },
          { 
            name: "Treino de Ombros", 
            duration: "55 min", 
            calories: "420 kcal", 
            icon: Trophy,
            exercises: [
              { name: "Desenvolvimento com Barra", sets: "4", reps: "8-10", rest: "90 seg", equipment: "Barra + Banco", instructions: "Subir acima da cabeça, descer controlado" },
              { name: "Elevação Lateral com Halteres", sets: "4", reps: "12-15", rest: "60 seg", equipment: "Halteres", instructions: "Braços levemente flexionados, subir até ombros" },
              { name: "Elevação Frontal com Anilha", sets: "3", reps: "12-15", rest: "60 seg", equipment: "Anilha", instructions: "Subir até altura dos olhos" },
              { name: "Crucifixo Inverso na Polia", sets: "3", reps: "12-15", rest: "60 seg", equipment: "Polia", instructions: "Trabalhar deltoide posterior" },
              { name: "Encolhimento com Halteres", sets: "4", reps: "15-20", rest: "45 seg", equipment: "Halteres", instructions: "Elevar ombros, contrair trapézio" }
            ]
          }
        ] : [
          { name: "Treino de Força", duration: "60 min", calories: "450 kcal", icon: Dumbbell, exercises: [] },
          { name: "Hipertrofia", duration: "50 min", calories: "400 kcal", icon: TrendingUp, exercises: [] },
          { name: "Treino de Potência", duration: "45 min", calories: "380 kcal", icon: Zap, exercises: [] },
          { name: "Treino de Força Funcional", duration: "40 min", calories: "350 kcal", icon: Trophy, exercises: [] }
        ]
      },
      "endurance": {
        title: "Plano de Resistência",
        description: "Aumente sua resistência e performance",
        workouts: isGym ? [
          { 
            name: "Resistência Cardiovascular", 
            duration: "60 min", 
            calories: "600 kcal", 
            icon: Activity,
            exercises: [
              { name: "Esteira - Corrida Contínua", sets: "1", reps: "20 min", rest: "-", equipment: "Esteira", instructions: "Velocidade 10-12 km/h, ritmo constante" },
              { name: "Bike Ergométrica", sets: "1", reps: "15 min", rest: "-", equipment: "Bike", instructions: "Resistência média-alta, 80-90 RPM" },
              { name: "Remo Ergômetro", sets: "1", reps: "15 min", rest: "-", equipment: "Remo", instructions: "Ritmo constante, 24-28 SPM" },
              { name: "Elíptico", sets: "1", reps: "10 min", rest: "-", equipment: "Elíptico", instructions: "Resistência alta, movimento fluido" },
              { name: "Alongamento", sets: "1", reps: "5 min", rest: "-", equipment: "Peso corporal", instructions: "Alongamento completo de membros inferiores" }
            ]
          },
          { 
            name: "Circuito de Resistência", 
            duration: "50 min", 
            calories: "520 kcal", 
            icon: Heart,
            exercises: [
              { name: "Agachamento com Salto", sets: "4", reps: "15", rest: "30 seg", equipment: "Peso corporal", instructions: "Salto explosivo, aterrissagem suave" },
              { name: "Remada na Polia (alta rep)", sets: "4", reps: "20", rest: "30 seg", equipment: "Polia", instructions: "Peso moderado, ritmo acelerado" },
              { name: "Afundo Alternado", sets: "4", reps: "20", rest: "30 seg", equipment: "Halteres leves", instructions: "Movimento contínuo, sem pausa" },
              { name: "Flexão + Prancha", sets: "4", reps: "10+30seg", rest: "45 seg", equipment: "Peso corporal", instructions: "10 flexões seguidas de prancha" },
              { name: "Bike Sprint", sets: "5", reps: "1 min", rest: "1 min", equipment: "Bike", instructions: "Máxima intensidade" }
            ]
          },
          { 
            name: "Treino Aeróbico Misto", 
            duration: "55 min", 
            calories: "580 kcal", 
            icon: Target,
            exercises: [
              { name: "Transport Inclinado", sets: "1", reps: "15 min", rest: "-", equipment: "Esteira", instructions: "Inclinação 12%, velocidade 5-6 km/h" },
              { name: "Escada Ergométrica", sets: "1", reps: "10 min", rest: "-", equipment: "Stair Climber", instructions: "Ritmo constante moderado" },
              { name: "Battle Rope", sets: "5", reps: "45 seg", rest: "45 seg", equipment: "Cordas Navais", instructions: "Movimentos ondulatórios" },
              { name: "Assault Bike", sets: "5", reps: "1 min", rest: "1 min", equipment: "Assault Bike", instructions: "Intensidade alta" },
              { name: "Remo Ergômetro", sets: "1", reps: "15 min", rest: "-", equipment: "Remo", instructions: "Finalização em ritmo moderado" }
            ]
          },
          { 
            name: "Resistência Muscular", 
            duration: "60 min", 
            calories: "550 kcal", 
            icon: Trophy,
            exercises: [
              { name: "Leg Press (alta rep)", sets: "4", reps: "25", rest: "45 seg", equipment: "Leg Press", instructions: "Peso moderado, sem travar joelhos" },
              { name: "Pulldown (alta rep)", sets: "4", reps: "20", rest: "45 seg", equipment: "Polia", instructions: "Movimento controlado, sem balanço" },
              { name: "Supino na Máquina (alta rep)", sets: "4", reps: "20", rest: "45 seg", equipment: "Máquina de Supino", instructions: "Ritmo constante" },
              { name: "Prancha com Elevação", sets: "4", reps: "45 seg", rest: "30 seg", equipment: "Peso corporal", instructions: "Alternar elevação de braços" },
              { name: "Elíptico Final", sets: "1", reps: "15 min", rest: "-", equipment: "Elíptico", instructions: "Resistência alta, finalização" }
            ]
          }
        ] : [
          { name: "Corrida Longa", duration: "60 min", calories: "600 kcal", icon: Activity, exercises: [] },
          { name: "Treino Aeróbico", duration: "50 min", calories: "500 kcal", icon: Heart, exercises: [] },
          { name: "Circuito Funcional", duration: "45 min", calories: "450 kcal", icon: Target, exercises: [] },
          { name: "Treino de Resistência", duration: "60 min", calories: "550 kcal", icon: Trophy, exercises: [] }
        ]
      }
    }

    return profile.goal ? plans[profile.goal] : plans["endurance"]
  }

  // Step -1: Landing Page
  if (step === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mb-6 shadow-2xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Transforme Seu Corpo e<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Alcance Seus Objetivos
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Você se olha no espelho e percebe que algo precisa mudar? Aquele corpo que você sempre sonhou parece estar cada vez mais distante? <strong className="text-white">Você não está sozinho!</strong> Milhares de pessoas enfrentam os mesmos desafios diariamente: a luta contra a balança, a dificuldade em ganhar massa muscular e a frustração em não conseguir melhorar a resistência nos esportes.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-400">
              Mas, e se eu te dissesse que a mudança está a um passo de você?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setStep(0)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Quero Começar Minha Transformação!
              </Button>
            </div>
          </div>

          {/* Conheça Nossos Planos Exclusivos */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
              Conheça Nossos Planos Exclusivos!
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">💪 Emagrecimento</CardTitle>
                  <CardDescription className="text-gray-300">
                    Elimine aqueles quilos indesejados de forma saudável e eficaz. Nossos programas são desenvolvidos por especialistas, com <strong>dietas personalizadas</strong> e <strong>treinos em aparelhos de academia</strong> para otimizar sua perda de peso. Diga adeus às dietas malucas que não trazem resultados!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">🏋️ Ganho de Massa Muscular</CardTitle>
                  <CardDescription className="text-gray-300">
                    Quer ganhar aquele volume que você tanto deseja? Nossos planos de ganho de massa incluem <strong>treinos em aparelhos de academia</strong> e <strong>nutrição personalizada</strong> para você se tornar a melhor versão de si mesmo!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">🏃 Melhora na Resistência</CardTitle>
                  <CardDescription className="text-gray-300">
                    Para os amantes do esporte, temos planos específicos para aumentar sua performance e resistência. <strong>Treinos em aparelhos de academia</strong> e <strong>alimentação estratégica</strong> que vão elevar seus treinos a um novo nível!
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Premium Plan Highlight */}
          <div className="mb-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
              Conheça o PLANO PREMIUM: Transformação com Tecnologia!
            </h2>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-8">
              Imagine contar as calorias da sua refeição apenas ao tirar uma foto! O nosso plano premium oferece essa inovação, <strong className="text-yellow-400">analisando automaticamente os alimentos</strong> e fornecendo dados precisos. Assim, fica muito mais fácil e prático manter o foco na sua dieta!
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setStep(0)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-2xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                Conhecer Plano Premium
              </Button>
            </div>
          </div>

          {/* Alimentação Saudável */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
              Alimentação Saudável na Palma da Sua Mão!
            </h2>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Além dos planos de emagrecimento e ganho de massa, oferecemos uma <strong className="text-emerald-400">extensa seção de receitas e sugestões de refeições saudáveis</strong> que vão facilitar sua jornada. Aprenda a cozinhar pratos deliciosos que ajudam a alcançar seus objetivos!
            </p>
          </div>

          {/* Por Que Escolher */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
              Por Que Escolher Nossa Plataforma?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Resultados Comprovados</h3>
                <p className="text-gray-300">Histórias de sucesso de nossos usuários para inspirar você!</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Apoio Contínuo</h3>
                <p className="text-gray-300">Nossa equipe de nutricionistas e treinadores está ao seu lado, ajudando a manter a motivação em alta.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Flexibilidade</h3>
                <p className="text-gray-300">Ajuste seu plano ao seu estilo de vida, com opções para diversos perfis e necessidades.</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-emerald-400 mb-2">10k+</div>
              <div className="text-gray-300 text-sm">Usuários Ativos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-cyan-400 mb-2">95%</div>
              <div className="text-gray-300 text-sm">Taxa de Sucesso</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-gray-300 text-sm">Exercícios</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Suporte</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
              Histórias de Sucesso
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      CS
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">Carlos Silva</CardTitle>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    "Perdi 12kg em 3 meses! Os treinos personalizados fizeram toda a diferença. Nunca me senti tão bem!"
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      AC
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">Ana Costa</CardTitle>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    "Ganhei massa muscular e força que nunca imaginei! O plano é completo e muito profissional."
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      PS
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">Pedro Santos</CardTitle>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    "Minha resistência melhorou absurdamente! Consigo correr 15km sem parar agora. Incrível!"
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center bg-gradient-to-r from-emerald-500/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Não Deixe Para Amanhã!
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Cada dia é uma nova oportunidade para mudar. Não adie a vida que você sempre sonhou! Conheça nossos planos, faça parte da nossa comunidade e comece a transformar o seu corpo e sua saúde agora mesmo.
            </p>
            <Button
              onClick={() => setStep(0)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-2" />
              Quero Começar Minha Transformação!
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              ✨ Sua jornada começa aqui. Vamos juntos!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              PeakFit
            </CardTitle>
            <CardDescription className="text-base">
              Transforme seu corpo com um plano 100% personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 rounded-xl border-2 border-emerald-200">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Por que somos diferentes?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Análise Completa</p>
                    <p className="text-xs text-gray-600">Avaliamos idade, peso, altura e nível de atividade</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Plano Personalizado</p>
                    <p className="text-xs text-gray-600">Treinos adaptados ao seu objetivo e biotipo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Resultados Reais</p>
                    <p className="text-xs text-gray-600">Mais de 10.000 pessoas já transformaram seus corpos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleNameSubmit(e.currentTarget.value.trim())
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector("input") as HTMLInputElement
                  if (input?.value.trim()) {
                    handleNameSubmit(input.value.trim())
                  }
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Começar Avaliação Gratuita
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-center text-gray-500">
                ⏱️ Leva apenas 2 minutos para completar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 1: Goal Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            </div>
            <CardTitle className="text-2xl">Olá, {profile.name}! 👋</CardTitle>
            <CardDescription>Qual é o seu objetivo principal?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleGoalSelect("weight-loss")}
              className="w-full h-auto py-6 flex flex-col items-center gap-2 bg-gradient-to-br from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <TrendingUp className="w-8 h-8" />
              <div>
                <p className="text-lg font-bold">Emagrecimento</p>
                <p className="text-sm opacity-90">Queime gordura e fique mais rápido</p>
              </div>
            </Button>
            <Button
              onClick={() => handleGoalSelect("weight-gain")}
              className="w-full h-auto py-6 flex flex-col items-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Dumbbell className="w-8 h-8" />
              <div>
                <p className="text-lg font-bold">Ganho de Peso</p>
                <p className="text-sm opacity-90">Construa massa muscular e força</p>
              </div>
            </Button>
            <Button
              onClick={() => handleGoalSelect("endurance")}
              className="w-full h-auto py-6 flex flex-col items-center gap-2 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Activity className="w-8 h-8" />
              <div>
                <p className="text-lg font-bold">Resistência Física</p>
                <p className="text-sm opacity-90">Aumente sua performance</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: Biometric Data
  if (step === 2) {
    const isFormValid = tempBiometrics.age && tempBiometrics.weight && tempBiometrics.height && tempBiometrics.gender
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-emerald-600 rounded"></div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            </div>
            <CardTitle className="text-2xl">Dados Biométricos</CardTitle>
            <CardDescription>Precisamos conhecer você melhor para criar seu plano ideal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Sexo</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => setTempBiometrics({ ...tempBiometrics, gender: "male" })}
                  variant={tempBiometrics.gender === "male" ? "default" : "outline"}
                  className={`h-auto py-4 ${tempBiometrics.gender === "male" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">👨</span>
                    <span className="font-semibold">Masculino</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  onClick={() => setTempBiometrics({ ...tempBiometrics, gender: "female" })}
                  variant={tempBiometrics.gender === "female" ? "default" : "outline"}
                  className={`h-auto py-4 ${tempBiometrics.gender === "female" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">👩</span>
                    <span className="font-semibold">Feminino</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Idade
              </label>
              <input
                type="number"
                placeholder="Ex: 25"
                value={tempBiometrics.age}
                onChange={(e) => setTempBiometrics({ ...tempBiometrics, age: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                min="15"
                max="100"
              />
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Peso Atual (kg)
              </label>
              <input
                type="number"
                placeholder="Ex: 75.5"
                value={tempBiometrics.weight}
                onChange={(e) => setTempBiometrics({ ...tempBiometrics, weight: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                step="0.1"
                min="30"
                max="300"
              />
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-emerald-600" />
                Altura (cm)
              </label>
              <input
                type="number"
                placeholder="Ex: 175"
                value={tempBiometrics.height}
                onChange={(e) => setTempBiometrics({ ...tempBiometrics, height: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                min="100"
                max="250"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                Foto (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {profile.biometrics.photoUrl ? (
                    <div className="space-y-2">
                      <img src={profile.biometrics.photoUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                      <p className="text-sm text-emerald-600 font-semibold">Foto carregada ✓</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Clique para adicionar uma foto</p>
                      <p className="text-xs text-gray-400">Isso nos ajuda a calcular seu IMC visual</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button
              onClick={handleBiometricsSubmit}
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 3: BMI Results & Activity Level
  if (step === 3) {
    const bmi = profile.biometrics.bmi
    const bmiCategory = profile.biometrics.bmiCategory
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-emerald-600 rounded"></div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-emerald-600 rounded"></div>
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            </div>
            <CardTitle className="text-2xl">Seu IMC Calculado</CardTitle>
            <CardDescription>Baseado nos seus dados biométricos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BMI Display */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 rounded-xl border-2 border-emerald-200 text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-3">
                  <span className="text-3xl font-bold text-emerald-600">{bmi}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{bmiCategory}</h3>
                <p className="text-sm text-gray-600 mt-1">Índice de Massa Corporal</p>
              </div>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-semibold">{profile.biometrics.age} anos</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-semibold">{profile.biometrics.weight} kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Altura:</span>
                  <span className="font-semibold">{profile.biometrics.height} cm</span>
                </div>
              </div>
            </div>

            {/* Activity Level Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Qual é seu nível de atividade atual?</h3>
              
              <Button
                onClick={() => handleActivityLevelSelect("sedentary")}
                className="w-full h-auto py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-emerald-500 shadow transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">Sedentário</p>
                  <p className="text-xs text-muted-foreground">Pouco ou nenhum exercício</p>
                </div>
              </Button>

              <Button
                onClick={() => handleActivityLevelSelect("light")}
                className="w-full h-auto py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-emerald-500 shadow transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">Levemente Ativo</p>
                  <p className="text-xs text-muted-foreground">Exercício leve 1-3 dias/semana</p>
                </div>
              </Button>

              <Button
                onClick={() => handleActivityLevelSelect("moderate")}
                className="w-full h-auto py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-emerald-500 shadow transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">Moderadamente Ativo</p>
                  <p className="text-xs text-muted-foreground">Exercício moderado 3-5 dias/semana</p>
                </div>
              </Button>

              <Button
                onClick={() => handleActivityLevelSelect("very-active")}
                className="w-full h-auto py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-emerald-500 shadow transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">Muito Ativo</p>
                  <p className="text-xs text-muted-foreground">Exercício intenso 6-7 dias/semana</p>
                </div>
              </Button>

              <Button
                onClick={() => handleActivityLevelSelect("extra-active")}
                className="w-full h-auto py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-emerald-500 shadow transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">Extremamente Ativo</p>
                  <p className="text-xs text-muted-foreground">Atleta profissional ou treino 2x/dia</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 4: Experience Level
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Qual é o seu nível de experiência?</CardTitle>
            <CardDescription>Vamos adaptar a intensidade dos treinos para você</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleLevelSelect("beginner")}
              className="w-full h-auto py-6 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Iniciante</p>
                  <p className="text-sm text-muted-foreground">Começando agora ou retornando após pausa</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => handleLevelSelect("intermediate")}
              className="w-full h-auto py-6 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-cyan-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Intermediário</p>
                  <p className="text-sm text-muted-foreground">Treino regularmente há 6+ meses</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => handleLevelSelect("advanced")}
              className="w-full h-auto py-6 flex items-center justify-between bg-white hover:bg-gray-50 text-gray-900 border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Avançado</p>
                  <p className="text-sm text-muted-foreground">Atleta experiente com 2+ anos de treino</p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 5: Training Location
  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Onde você prefere treinar?</CardTitle>
            <CardDescription>Vamos personalizar seus treinos para o ambiente ideal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleLocationSelect("gym")}
              className="w-full h-auto py-8 flex flex-col items-center gap-3 bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Dumbbell className="w-12 h-12" />
              <div>
                <p className="text-xl font-bold">Academia</p>
                <p className="text-sm opacity-90">Acesso a equipamentos completos e variados</p>
              </div>
            </Button>
            <Button
              onClick={() => handleLocationSelect("home")}
              className="w-full h-auto py-8 flex flex-col items-center gap-3 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-12 h-12" />
              <div>
                <p className="text-xl font-bold">Em Casa</p>
                <p className="text-sm opacity-90">Treinos com peso corporal e equipamentos mínimos</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 6: Plan Selection
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Escolha Seu Plano</CardTitle>
            <CardDescription>Baseado no seu perfil, recomendamos o plano ideal para você</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Plano Essencial */}
            <div className="bg-white p-6 rounded-xl border-2 border-emerald-500 hover:border-emerald-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-emerald-500 text-white mb-2">Essencial</Badge>
                  <h3 className="text-2xl font-bold text-gray-900">R$ 39,90<span className="text-base font-normal text-muted-foreground">/mês</span></h3>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Planos de treino 100% personalizados</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Treinos adaptados para {profile.location === "gym" ? "academia" : "casa"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm font-semibold">Plano de alimentação personalizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Acesso à comunidade exclusiva</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Acompanhamento de progresso detalhado</span>
                </li>
              </ul>
              <Button
                onClick={() => handlePlanChoice("essential")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Escolher Essencial
              </Button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-400 hover:border-yellow-500 transition-colors relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Recomendado para Você</Badge>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-2">Premium</Badge>
                  <h3 className="text-2xl font-bold text-gray-900">R$ 59,90<span className="text-base font-normal text-muted-foreground">/mês</span></h3>
                  <p className="text-xs text-muted-foreground mt-1">Economia de R$ 20/mês vs adicionar depois</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm font-semibold">Tudo do Plano Essencial</span>
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold">Contador de calorias por foto</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Análise nutricional completa com IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
              <Button
                onClick={() => handlePlanChoice("premium")}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Escolher Premium
              </Button>
            </div>

            <p className="text-center text-sm text-white/80 mt-4">
              💡 Você pode adicionar o contador de calorias depois por R$ 29,90/mês extra
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 7: Summary & Confirmation
  if (step === 7) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Seu Plano Está Pronto!</CardTitle>
            <CardDescription>Revise suas informações antes de começar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 rounded-xl border-2 border-emerald-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Resumo do Seu Perfil</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nome:</span>
                  <span className="font-semibold">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Objetivo:</span>
                  <Badge variant="secondary">
                    {profile.goal === "weight-loss" ? "Emagrecimento" : profile.goal === "weight-gain" ? "Ganho de Peso" : "Resistência"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IMC:</span>
                  <span className="font-semibold">{profile.biometrics.bmi} - {profile.biometrics.bmiCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nível de Atividade:</span>
                  <span className="font-semibold capitalize">
                    {profile.biometrics.activityLevel === "sedentary" ? "Sedentário" :
                     profile.biometrics.activityLevel === "light" ? "Levemente Ativo" :
                     profile.biometrics.activityLevel === "moderate" ? "Moderadamente Ativo" :
                     profile.biometrics.activityLevel === "very-active" ? "Muito Ativo" : "Extremamente Ativo"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experiência:</span>
                  <span className="font-semibold capitalize">
                    {profile.level === "beginner" ? "Iniciante" : profile.level === "intermediate" ? "Intermediário" : "Avançado"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Local de Treino:</span>
                  <span className="font-semibold">{profile.location === "gym" ? "Academia" : "Em Casa"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plano Escolhido:</span>
                  <Badge className={profile.plan === "premium" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" : "bg-emerald-500 text-white"}>
                    {profile.plan === "premium" ? "Premium" : "Essencial"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">O Que Vem Agora?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Acesse seu Dashboard</p>
                    <p className="text-xs text-gray-600">Veja seus treinos e plano alimentar personalizados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Comece Seu Primeiro Treino</p>
                    <p className="text-xs text-gray-600">Siga as instruções passo a passo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Compartilhe na Comunidade</p>
                    <p className="text-xs text-gray-600">Inspire e seja inspirado por outros</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(8)}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ir para o Dashboard
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Dashboard (Step 8)
  const workoutPlan = getWorkoutPlan()
  const mealPlan = getMealPlan()
  const progress = (profile.completedWorkouts / 20) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PeakFit</h1>
                <p className="text-sm opacity-90">Olá, {profile.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={profile.plan === "premium" ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500" : "bg-emerald-400 text-emerald-900 hover:bg-emerald-500"}>
                <Award className="w-3 h-3 mr-1" />
                {profile.plan === "premium" ? "Premium" : "Essencial"}
              </Badge>
              <Button
                onClick={resetProfile}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reiniciar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
            <TabsTrigger value="nutrition">Alimentação</TabsTrigger>
            <TabsTrigger value="community">Comunidade</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Progress Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>
                  {profile.completedWorkouts} de 20 treinos concluídos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-3" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-emerald-600">{profile.completedWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Treinos</p>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-cyan-600">{Math.round(progress)}%</p>
                    <p className="text-xs text-muted-foreground">Progresso</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">{profile.completedWorkouts * 450}</p>
                    <p className="text-xs text-muted-foreground">Calorias</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{20 - profile.completedWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Restantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biometric Summary */}
            <Card className="shadow-lg border-2 border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-600" />
                  Seus Dados Biométricos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.biometrics.bmi}</p>
                    <p className="text-xs text-muted-foreground">IMC</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.biometrics.weight}kg</p>
                    <p className="text-xs text-muted-foreground">Peso</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.biometrics.height}cm</p>
                    <p className="text-xs text-muted-foreground">Altura</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.biometrics.age}</p>
                    <p className="text-xs text-muted-foreground">Anos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Card */}
            <Card className="shadow-lg border-2 border-emerald-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  {workoutPlan.title}
                </CardTitle>
                <CardDescription>{workoutPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {profile.level === "beginner" ? "Iniciante" : profile.level === "intermediate" ? "Intermediário" : "Avançado"}
                  </Badge>
                  <Badge variant="secondary">
                    {profile.location === "gym" ? "Academia" : "Em Casa"}
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {profile.plan === "premium" ? "Plano Premium" : "Plano Essencial"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            {profile.plan === "premium" && (
              <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-600" />
                    Recursos Premium
                  </CardTitle>
                  <CardDescription>Ferramentas exclusivas para você</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 shadow">
                    <Camera className="w-4 h-4 mr-2" />
                    Calcular Calorias por Foto
                  </Button>
                  <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 shadow">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Análise Nutricional Completa
                  </Button>
                  <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 shadow">
                    <Award className="w-4 h-4 mr-2" />
                    Suporte Prioritário
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Upgrade Card for Essential Users */}
            {profile.plan === "essential" && (
              <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    Adicione o Contador de Calorias
                  </CardTitle>
                  <CardDescription>
                    Tenha controle total da sua alimentação com análise por foto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-semibold">Cálculo de calorias por foto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-semibold">Análise nutricional completa</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Adicione por apenas:</p>
                    <p className="text-2xl font-bold text-gray-900">+ R$ 29,90<span className="text-base font-normal text-muted-foreground">/mês</span></p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                    Adicionar Contador de Calorias
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Ou faça upgrade para Premium por R$ 59,90/mês e economize R$ 20/mês
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {workoutPlan.workouts.map((workout, index) => {
                const Icon = workout.icon
                const hasExercises = workout.exercises && workout.exercises.length > 0
                
                return (
                  <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon className="w-5 h-5 text-emerald-600" />
                          {workout.name}
                        </CardTitle>
                        <Badge className="bg-emerald-100 text-emerald-700">{workout.duration}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        {workout.calories}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {hasExercises && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
                          <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                            <Dumbbell className="w-4 h-4 text-emerald-600" />
                            Exercícios do Treino
                          </h4>
                          {workout.exercises.map((exercise, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-sm text-gray-900">{exercise.name}</h5>
                                {exercise.equipment && (
                                  <Badge variant="outline" className="text-xs">{exercise.equipment}</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <div className="text-center bg-emerald-50 p-2 rounded">
                                  <p className="text-xs text-gray-600">Séries</p>
                                  <p className="font-bold text-sm text-emerald-700">{exercise.sets}</p>
                                </div>
                                <div className="text-center bg-cyan-50 p-2 rounded">
                                  <p className="text-xs text-gray-600">Reps</p>
                                  <p className="font-bold text-sm text-cyan-700">{exercise.reps}</p>
                                </div>
                                <div className="text-center bg-orange-50 p-2 rounded">
                                  <p className="text-xs text-gray-600">Descanso</p>
                                  <p className="font-bold text-sm text-orange-700">{exercise.rest}</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 italic">{exercise.instructions}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        onClick={completeWorkout}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg"
                      >
                        Iniciar Treino
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card className="shadow-lg border-2 border-emerald-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  Seu Plano Alimentar Personalizado
                </CardTitle>
                <CardDescription>
                  Refeições balanceadas para {profile.goal === "weight-loss" ? "emagrecimento" : profile.goal === "weight-gain" ? "ganho de peso" : "resistência"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Breakfast */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🌅</span>
                    Café da Manhã
                  </h3>
                  <ul className="space-y-2">
                    {mealPlan.breakfast.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lunch */}
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 rounded-xl border border-emerald-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">☀️</span>
                    Almoço
                  </h3>
                  <ul className="space-y-2">
                    {mealPlan.lunch.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dinner */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🌙</span>
                    Jantar
                  </h3>
                  <ul className="space-y-2">
                    {mealPlan.dinner.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Snacks */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    Lanches
                  </h3>
                  <ul className="space-y-2">
                    {mealPlan.snacks.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 rounded-xl border-2 border-emerald-200">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Dica:</strong> Beba pelo menos 2 litros de água por dia e ajuste as porções de acordo com sua fome e necessidades individuais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            {/* Share Result */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-600" />
                  Compartilhe Seu Resultado
                </CardTitle>
                <CardDescription>Inspire outros atletas com sua jornada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Conte sobre seus resultados, conquistas ou desafios..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors min-h-[100px] resize-none"
                />
                <Button
                  onClick={handleShare}
                  disabled={!newPost.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Comunidade PeakFit
              </h3>
              {communityPosts.map((post) => (
                <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                          {post.user.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{post.user}</CardTitle>
                          <CardDescription className="text-xs">{post.date}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{post.goal}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{post.result}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleLike(post.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        {post.likes}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Comentar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
