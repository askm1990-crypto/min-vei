import { useState } from 'react';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/ToastUtils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BreathingExercise from './tools/BreathingExercise';
import Grounding from './tools/Grounding';
import BodyScan from './tools/BodyScan';
import CravingTimer from './tools/CravingTimer';
import TIPPTechnique from './tools/TIPPTechnique';
import ProsCons from './tools/ProsCons';
import FiveSenses from './tools/FiveSenses';
import PLEASESkills from './tools/PLEASESkills';
import OppositeAction from './tools/OppositeAction';
import Distraction from './tools/Distraction';
import DEARMAN from './tools/DEARMAN';
import './Strategies.css';

const DBT_MODULES = [
    {
        id: 'mindfulness',
        title: 'Mindfulness',
        subtitle: 'Oppmerksomt nærvær',
        emoji: '🧘',
        color: 'hsl(210, 70%, 50%)',
        tools: [
            { id: 'breathing', title: 'Pusteøvelse', emoji: '🌬️', desc: '4-7-8 teknikk', points: 20, component: BreathingExercise },
            { id: 'grounding', title: '5-4-3-2-1 Grounding', emoji: '⚓', desc: 'Guidet sanseøvelse', points: 20, component: Grounding },
            { id: 'bodyscan', title: 'Kroppsskanning', emoji: '🧘', desc: 'Guidet body scan', points: 20, component: BodyScan },
        ]
    },
    {
        id: 'distress',
        title: 'Distress Tolerance',
        subtitle: 'Utholdenhets-ferdigheter',
        emoji: '🛡️',
        color: 'hsl(25, 80%, 50%)',
        tools: [
            { id: 'timer', title: 'Sug-timer', emoji: '⏱️', desc: 'Vent det ut (15 min)', points: 30, component: CravingTimer },
            { id: 'tipp', title: 'TIPP-teknikken', emoji: '🧊', desc: 'Temperatur, Intens trening, Pust, Muskelavspenning', points: 20, component: TIPPTechnique },
            { id: 'proscons', title: 'Pros & Cons', emoji: '⚖️', desc: 'Fordeler/ulemper med å gi etter', points: 20, component: ProsCons },
            { id: 'fivesenses', title: '5 sanser', emoji: '🛁', desc: 'Selvberoligende sanseøvelse', points: 20, component: FiveSenses },
        ]
    },
    {
        id: 'emotion',
        title: 'Emotion Regulation',
        subtitle: 'Følelsesregulering',
        emoji: '💚',
        color: 'hsl(150, 60%, 40%)',
        tools: [
            { id: 'please', title: 'PLEASE-ferdigheter', emoji: '💊', desc: 'Sjekkliste for fysisk sårbarhet', points: 15, component: PLEASESkills },
            { id: 'opposite', title: 'Motstatt handling', emoji: '🔄', desc: 'Gjør det motsatte av impulsen', points: 20, component: OppositeAction },
            { id: 'distraction', title: 'Distraksjon', emoji: '🔀', desc: 'Tilfeldig aktivitetsforslag', points: 15, component: Distraction },
        ]
    },
    {
        id: 'interpersonal',
        title: 'Interpersonal Effectiveness',
        subtitle: 'Mellommenneskelige ferdigheter',
        emoji: '🗣️',
        color: 'hsl(280, 60%, 50%)',
        tools: [
            { id: 'dearman', title: 'DEAR MAN', emoji: '🗣️', desc: 'Steg-for-steg kommunikasjon', points: 20, component: DEARMAN },
        ]
    }
];

export default function Strategies() {
    const { addPoints } = useRecoveryScore();
    const [activeTool, setActiveTool] = useState(null);

    const handleToolComplete = (tool) => {
        addPoints(tool.points, `Brukte verktøy: ${tool.title}`);
        showToast(`Bra jobba! +${tool.points} poeng 🧠`, 'success');
        setActiveTool(null);
    };

    // If a tool is active, render it full-screen
    if (activeTool) {
        const ActiveComponent = activeTool.component;
        return (
            <div className="tool-fullscreen view-enter">
                <div className="tool-header">
                    <button className="wizard-back-btn" onClick={() => setActiveTool(null)}>
                        ← Tilbake
                    </button>
                    <span className="tool-points-badge">+{activeTool.points}p</span>
                </div>
                <ActiveComponent onComplete={() => handleToolComplete(activeTool)} />
            </div>
        );
    }

    return (
        <div className="strategies-page">
            <h2 className="strategies-title">Verktøykasse</h2>
            <p className="strategies-subtitle">DBT-inspirerte verktøy for å håndtere sug, følelser og vanskelige situasjoner.</p>

            {DBT_MODULES.map(mod => (
                <div key={mod.id} className="dbt-module">
                    <div className="dbt-module-header" style={{ borderLeftColor: mod.color }}>
                        <span className="dbt-emoji">{mod.emoji}</span>
                        <div>
                            <h3 className="dbt-title">{mod.title}</h3>
                            <p className="dbt-subtitle">{mod.subtitle}</p>
                        </div>
                    </div>

                    <div className="tools-grid">
                        {mod.tools.map(tool => (
                            <Card
                                key={tool.id}
                                className="tool-card"
                                onClick={() => setActiveTool(tool)}
                            >
                                <span className="tool-emoji">{tool.emoji}</span>
                                <div className="tool-info">
                                    <strong className="tool-name">{tool.title}</strong>
                                    <span className="tool-desc">{tool.desc}</span>
                                </div>
                                <span className="tool-points">+{tool.points}p</span>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
