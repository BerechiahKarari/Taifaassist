// AI Service - supports multiple providers
// For production, add your API keys to .env file

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'local'; // 'openai', 'anthropic', or 'local'
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo';
    
    // Knowledge base for Kenyan government services
    this.knowledgeBase = {
      passport: {
        en: "To apply for a Kenyan passport:\n1. Visit eCitizen (ecitizen.go.ke)\n2. Create an account or log in\n3. Fill the passport application form\n4. Pay Ksh 4,550 for 34-page or Ksh 7,550 for 50-page\n5. Book appointment at Immigration office\n6. Bring: National ID, Birth Certificate, 2 passport photos\n7. Processing takes 10-14 working days",
        sw: "Kuomba pasipoti ya Kenya:\n1. Tembelea eCitizen (ecitizen.go.ke)\n2. Fungua akaunti au ingia\n3. Jaza fomu ya maombi ya pasipoti\n4. Lipa Ksh 4,550 kwa kurasa 34 au Ksh 7,550 kwa kurasa 50\n5. Weka miadi katika ofisi ya Uhamiaji\n6. Leta: Kitambulisho cha Kitaifa, Cheti cha Kuzaliwa, picha 2 za pasipoti\n7. Uchakataji unachukua siku 10-14 za kazi"
      },
      kra: {
        en: "To register for KRA PIN:\n1. Visit iTax portal (itax.kra.go.ke)\n2. Click 'Register PIN'\n3. Select individual/business\n4. Fill personal details\n5. Upload ID copy\n6. Submit application\n7. PIN sent via SMS/email within 3-7 days\n\nFor faster service, visit KRA Huduma Centre with your ID.",
        sw: "Kusajili PIN ya KRA:\n1. Tembelea iTax (itax.kra.go.ke)\n2. Bonyeza 'Sajili PIN'\n3. Chagua mtu binafsi/biashara\n4. Jaza maelezo binafsi\n5. Pakia nakala ya kitambulisho\n6. Wasilisha maombi\n7. PIN itatumwa kupitia SMS/barua pepe ndani ya siku 3-7\n\nKwa huduma ya haraka, tembelea Kituo cha KRA Huduma na kitambulisho chako."
      },
      nhif: {
        en: "NHIF Registration:\n1. Visit NHIF office or selfcare.nhif.or.ke\n2. Fill registration form\n3. Provide: ID, passport photo, employer letter (if employed)\n4. Pay registration fee (Ksh 500 for self-employed)\n5. Monthly contributions: Ksh 500 (self-employed) or salary-based\n6. Card issued within 30 days\n\nBenefits: Inpatient (Ksh 10,000-100,000), Outpatient, Maternity",
        sw: "Usajili wa NHIF:\n1. Tembelea ofisi ya NHIF au selfcare.nhif.or.ke\n2. Jaza fomu ya usajili\n3. Toa: Kitambulisho, picha ya pasipoti, barua ya mwajiri (ikiwa umeajiriwa)\n4. Lipa ada ya usajili (Ksh 500 kwa wajitegemea)\n5. Michango ya kila mwezi: Ksh 500 (wajitegemea) au kulingana na mshahara\n6. Kadi itatolewa ndani ya siku 30\n\nFaida: Wagonjwa wa ndani (Ksh 10,000-100,000), Wagonjwa wa nje, Uzazi"
      },
      id: {
        en: "National ID Application:\n1. Must be 18+ years old\n2. Get form from chief's office\n3. Provide: Birth certificate, passport photo, parents' IDs\n4. Submit at registration center\n5. Biometric capture (fingerprints, photo)\n6. Processing: 30-60 days\n7. Collect from chief's office\n\nLost ID replacement: Visit Huduma Centre with police abstract",
        sw: "Maombi ya Kitambulisho cha Kitaifa:\n1. Lazima uwe na umri wa miaka 18+\n2. Pata fomu kutoka ofisi ya chief\n3. Toa: Cheti cha kuzaliwa, picha ya pasipoti, vitambulisho vya wazazi\n4. Wasilisha katika kituo cha usajili\n5. Unaswa alama za kidole na picha\n6. Uchakataji: siku 30-60\n7. Pokea kutoka ofisi ya chief\n\nKubadilisha kitambulisho kilichopotea: Tembelea Kituo cha Huduma na muhtasari wa polisi"
      }
    };
  }

  async generateResponse(message, language = 'en', context = {}) {
    // Try AI provider first, fallback to local
    if (this.provider === 'openai' && this.apiKey) {
      return await this.getOpenAIResponse(message, language, context);
    } else if (this.provider === 'anthropic' && this.apiKey) {
      return await this.getAnthropicResponse(message, language, context);
    } else {
      return this.getLocalResponse(message, language);
    }
  }

  async getOpenAIResponse(message, language, context) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are TaifaAssist, a helpful assistant for Kenyan government services. Respond in ${language === 'sw' ? 'Kiswahili' : 'English'}. Be concise, friendly, and accurate. Focus on: passports, KRA PIN, NHIF, National ID, driving licenses, and business registration.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const data = await response.json();
      return {
        response: data.choices[0].message.content,
        suggestLiveAgent: this.shouldSuggestAgent(message)
      };
    } catch (error) {
      console.error('OpenAI error:', error);
      return this.getLocalResponse(message, language);
    }
  }

  async getAnthropicResponse(message, language, context) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `You are TaifaAssist, helping with Kenyan government services. Respond in ${language === 'sw' ? 'Kiswahili' : 'English'}.\n\nUser: ${message}`
          }]
        })
      });

      const data = await response.json();
      return {
        response: data.content[0].text,
        suggestLiveAgent: this.shouldSuggestAgent(message)
      };
    } catch (error) {
      console.error('Anthropic error:', error);
      return this.getLocalResponse(message, language);
    }
  }

  getLocalResponse(message, language) {
    const lowerMessage = message.toLowerCase();
    
    // Check knowledge base
    for (const [key, content] of Object.entries(this.knowledgeBase)) {
      if (lowerMessage.includes(key) || 
          (key === 'passport' && lowerMessage.includes('pasipoti')) ||
          (key === 'id' && lowerMessage.includes('kitambulisho'))) {
        return {
          response: content[language] || content.en,
          suggestLiveAgent: false
        };
      }
    }

    // Default response
    const defaultResponses = {
      en: `I can help you with:\n• Passport applications\n• KRA PIN registration\n• NHIF registration\n• National ID applications\n• Driving licenses\n• Business registration\n\nWhat would you like to know about?`,
      sw: `Ninaweza kukusaidia na:\n• Maombi ya pasipoti\n• Usajili wa PIN ya KRA\n• Usajili wa NHIF\n• Maombi ya Kitambulisho cha Kitaifa\n• Leseni za udereva\n• Usajili wa biashara\n\nUngependa kujua nini?`
    };

    return {
      response: defaultResponses[language] || defaultResponses.en,
      suggestLiveAgent: this.shouldSuggestAgent(message)
    };
  }

  shouldSuggestAgent(message) {
    const agentKeywords = ['help', 'agent', 'person', 'human', 'speak', 'talk', 'msaidizi', 'mtu'];
    return agentKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }
}

export const aiService = new AIService();
