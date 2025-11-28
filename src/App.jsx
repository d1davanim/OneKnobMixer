import React, { useState, useEffect, useRef } from 'react';
import { Settings, Check, X, Disc, Power, Radio, Zap, Play, Pause, Upload, VolumeX, Activity, Download, Save, BarChart3, Globe } from 'lucide-react';

// --- Translation Dictionary ---
const TRANSLATIONS = {
  EN: {
    titleMain: "MIX",
    titleSub: "LAUNCHER",
    subtitle: "TACTICAL AUDIO PROCESSOR",
    freq: "FREQ",
    dataLoaded: "DATA LOADED",
    insertData: "INSERT DATA CARTRIDGE",
    push: "PUSH",
    tactical: "TACTICAL",
    adjust: "ADJUST",
    caution: "CAUTION: HIGH SPL OUTPUT",
    orbitalLink: "ORBITAL LINK ESTABLISHED",
    disengage: "DISENGAGE",
    engage: "ENGAGE",
    systemActive: "System Active",
    readyToPlay: "Ready to Play",
    sequenceComplete: "SEQUENCE COMPLETE",
    abort: "Abort Mission",
    mode: "MODE",
    thrust: "THRUST",
    stealth: "STEALTH",
    deploy: "DEPLOY",
    missionDebrief: "MISSION DEBRIEF",
    analysisReport: "AUDIO SIGNAL ANALYSIS REPORT",
    original: "ORIGINAL (RAW)",
    processed: "PROCESSED (MIXED)",
    eqSpectrum: "EQ SPECTRUM ANALYSIS",
    responseProfile: "RESPONSE PROFILE",
    dynamicRange: "DYNAMIC RANGE",
    loudness: "LOUDNESS (RMS)",
    gainIncrease: "GAIN INCREASE",
    peakCeiling: "PEAK CEILING",
    limiterStatus: "LIMITER STATUS",
    detailRecovery: "DETAIL RECOVERY",
    lowLevelDetail: "LOW LEVEL DETAIL",
    boosted: "BOOSTED",
    balanced: "BALANCED",
    harmonicBoost: "HARMONIC BOOST",
    engaged: "ENGAGED",
    compressed: "COMPRESSED",
    file: "FILE",
    format: "FORMAT",
    confirmDownload: "CONFIRM & DOWNLOAD",
    processing: "PROCESSING...",
    tacticalConfig: "TACTICAL CONFIGURATION",
    confirmParams: "Confirm Params",
    subLabelStealth: "DRY VOCAL",
    subLabelOverdrive: "1.4K/7.5K BOOST",
    subLabelMagnetic: "TAPE SATURATION",
    subLabelAggressive: "AGGRESSIVE COMP",
    subLabelGentle: "GENTLE COMP",
    dynamicsThrust: "DYNAMICS THRUST",
    freqLabels: ['SUB', 'LOW', 'MID', 'HIGH', 'AIR'],
    raw: "RAW",
    mix: "MIX",
    in: "IN",
    out: "OUT"
  },
  CN: {
    titleMain: "混音",
    titleSub: "发射台",
    subtitle: "战术音频处理器",
    freq: "采样率",
    dataLoaded: "数据已装载",
    insertData: "插入数据磁带",
    push: "发射",
    tactical: "战术调整",
    adjust: "调整",
    caution: "警告：高声压级输出",
    orbitalLink: "轨道链接已建立",
    disengage: "停止",
    engage: "启动",
    systemActive: "系统运行中",
    readyToPlay: "就绪",
    sequenceComplete: "序列完成",
    abort: "中止任务",
    mode: "模式",
    thrust: "推力",
    stealth: "隐形",
    deploy: "部署",
    missionDebrief: "任务简报",
    analysisReport: "音频信号分析报告",
    original: "原始 (RAW)",
    processed: "处理后 (MIXED)",
    eqSpectrum: "EQ 频谱分析",
    responseProfile: "响应配置",
    dynamicRange: "动态范围",
    loudness: "响度 (RMS)",
    gainIncrease: "增益提升",
    peakCeiling: "峰值上限",
    limiterStatus: "限制器状态",
    detailRecovery: "细节恢复",
    lowLevelDetail: "低电平细节",
    boosted: "已提升",
    balanced: "平衡",
    harmonicBoost: "谐波增强",
    engaged: "已介入",
    compressed: "已压缩",
    file: "文件",
    format: "格式",
    confirmDownload: "确认并下载",
    processing: "处理中...",
    tacticalConfig: "战术配置面板",
    confirmParams: "确认参数",
    subLabelStealth: "干声模式",
    subLabelOverdrive: "1.4K/7.5K 激励",
    subLabelMagnetic: "磁带饱和",
    subLabelAggressive: "激进压缩",
    subLabelGentle: "柔和压缩",
    dynamicsThrust: "动态推力杆",
    freqLabels: ['超低', '低频', '中频', '高频', '超高'],
    raw: "原声",
    mix: "混音",
    in: "输入",
    out: "输出"
  }
};

// --- Helper Components ---

// 1. Frequency Response Chart
const EqFrequencyResponseChart = ({ dataOriginal, dataProcessed, labels, t }) => {
    const width = 200;
    const height = 100;
    const padding = 15;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const getY = (val) => {
        const safeVal = Math.max(0.2, Math.min(val, 1.0));
        const n = (safeVal - 0.2) / 0.8;
        return padding + graphHeight - (n * graphHeight);
    };

    const getX = (index) => {
        return padding + (index / (labels.length - 1)) * graphWidth;
    };

    const makePath = (data) => {
        if (!data || data.length === 0) return "";
        let path = `M ${getX(0)} ${getY(data[0])}`;
        for (let i = 1; i < data.length; i++) {
            path += ` L ${getX(i)} ${getY(data[i])}`;
        }
        return path;
    };

    const makeArea = (data) => {
        if (!data || data.length === 0) return "";
        let path = makePath(data);
        path += ` L ${getX(data.length - 1)} ${height - padding}`;
        path += ` L ${getX(0)} ${height - padding}`;
        path += " Z";
        return path;
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <line x1={padding} y1={getY(0.6)} x2={width - padding} y2={getY(0.6)} stroke="#555" strokeWidth="1" strokeDasharray="2,2" />
            <text x={width - padding + 4} y={getY(0.6) + 2} fontSize="8" fill="#888" className="font-sans font-bold">0dB</text>
            <line x1={padding} y1={getY(0.75)} x2={width - padding} y2={getY(0.75)} stroke="#333" strokeWidth="0.5" />
            <line x1={padding} y1={getY(0.45)} x2={width - padding} y2={getY(0.45)} stroke="#333" strokeWidth="0.5" />

            {labels.map((l, i) => (
                <g key={i}>
                    <line x1={getX(i)} y1={padding} x2={getX(i)} y2={height - padding} stroke="#222" strokeWidth="0.5" />
                    <text x={getX(i)} y={height - 2} fontSize="8" fill="#999" textAnchor="middle" className="font-sans font-bold">{l}</text>
                </g>
            ))}

            <path d={makeArea(dataProcessed)} fill="url(#greenGradient)" stroke="none" opacity="0.3" />
            <path d={makePath(dataProcessed)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={makePath(dataOriginal)} fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.8" />

            <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0"/>
                </linearGradient>
            </defs>
        </svg>
    );
};

// 2. Dynamic Range Bar
const DynamicRangeBar = ({ minDbOriginal, maxDbOriginal, minDbProcessed, maxDbProcessed, t }) => {
    const mapDbToPercent = (db) => Math.max(0, Math.min(100, (db + 60) / 60 * 100));
    const oTop = mapDbToPercent(maxDbOriginal);
    const oBot = mapDbToPercent(minDbOriginal);
    const pTop = mapDbToPercent(maxDbProcessed);
    const pBot = mapDbToPercent(minDbProcessed);

    return (
        <div className="flex justify-center gap-6 h-full w-full px-4 items-end relative">
            <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-zinc-400 pointer-events-none py-1 h-full font-sans font-bold">
                <span className="border-b border-zinc-800 w-full text-right pr-1">0dB</span>
                <span className="border-b border-zinc-800 w-full text-right pr-1">-20dB</span>
                <span className="border-b border-zinc-800 w-full text-right pr-1">-40dB</span>
                <span className="border-b border-zinc-800 w-full text-right pr-1">-60dB</span>
            </div>
            <div className="relative w-10 h-full bg-zinc-900 rounded-sm z-10">
                <div className="absolute w-full bg-yellow-500/10 border border-yellow-600/50 transition-all duration-500" style={{ bottom: `${oBot}%`, height: `${Math.max(1, oTop - oBot)}%` }}></div>
                <div className="absolute w-full h-[2px] bg-yellow-500 shadow-[0_0_5px_yellow]" style={{ bottom: `${oTop}%` }}></div>
                <div className="absolute w-full h-[1px] bg-yellow-900" style={{ bottom: `${oBot}%` }}></div>
                <div className="absolute -top-5 w-full text-center text-[10px] text-yellow-500 font-bold tracking-wider font-sans">{t.raw}</div>
            </div>
            <div className="relative w-10 h-full bg-zinc-900 rounded-sm z-10">
                <div className="absolute w-full bg-green-500/20 border border-green-500/50 transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" style={{ bottom: `${pBot}%`, height: `${Math.max(1, pTop - pBot)}%` }}></div>
                <div className="absolute w-full h-[2px] bg-green-400 shadow-[0_0_8px_#4ade80]" style={{ bottom: `${pTop}%` }}></div>
                <div className="absolute w-full h-[1px] bg-green-800" style={{ bottom: `${pBot}%` }}></div>
                <div className="absolute -top-5 w-full text-center text-[10px] text-green-400 font-bold tracking-wider font-sans">{t.mix}</div>
            </div>
        </div>
    );
};

// 3. Bar Chart Component
const BarComparison = ({ val1, val2 }) => (
    <div className="flex gap-4 h-full items-end justify-center w-full px-4">
        <div className="w-6 bg-zinc-700/30 relative group h-full flex items-end border-b-2 border-yellow-900/30">
             <div style={{height: `${Math.min((val1 || 0) * 100, 100)}%`}} className="w-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all duration-500"></div>
        </div>
        <div className="w-6 bg-zinc-700/30 relative group h-full flex items-end border-b-2 border-green-900/30">
             <div style={{height: `${Math.min((val2 || 0) * 100, 100)}%`}} className="w-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-500"></div>
        </div>
    </div>
);

// 4. Toggle Button Component
const ToggleButton = ({ label, subLabel, active, onClick, icon: Icon }) => (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center p-3 border-2 transition-all duration-200 w-full h-24 ${active ? 'bg-yellow-900/40 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-zinc-800/50 border-zinc-700 hover:border-yellow-700'}`}>
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${active ? 'bg-yellow-400 shadow-[0_0_5px_yellow]' : 'bg-zinc-600'}`}></div>
        {Icon && <Icon className={`w-6 h-6 mb-2 ${active ? 'text-yellow-400' : 'text-zinc-400'}`} />}
        <span className={`font-sans font-bold text-sm tracking-wider ${active ? 'text-yellow-100' : 'text-zinc-300'}`}>{label}</span>
        <span className="font-sans font-medium text-[10px] text-zinc-500 uppercase mt-1">{subLabel}</span>
    </button>
);

// --- Audio DSP Helpers ---

const makeTapeCurve = (amount) => {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = Math.tanh(x * (1 + amount * 2)); 
  }
  return curve;
};

const createImpulseResponse = (context, duration, decay) => {
  const length = context.sampleRate * duration;
  const impulse = context.createBuffer(2, length, context.sampleRate);
  const L = impulse.getChannelData(0);
  const R = impulse.getChannelData(1);
  for (let i = 0; i < length; i++) {
    const n = i; 
    const k = Math.pow(1 - n / length, decay);
    L[i] = (Math.random() * 2 - 1) * k;
    R[i] = (Math.random() * 2 - 1) * k;
  }
  return impulse;
};

function bufferToWave24(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 3 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

    setUint32(0x46464952); 
    setUint32(length - 8); 
    setUint32(0x45564157); 

    setUint32(0x20746d66); 
    setUint32(16); 
    setUint16(1); 
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 3 * numOfChan); 
    setUint16(numOfChan * 3); 
    setUint16(24); 

    setUint32(0x61746164); 
    setUint32(length - pos - 4); 

    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

    while (pos < len) {
      for (i = 0; i < numOfChan; i++) {
        let s = Math.max(-1, Math.min(1, channels[i][pos]));
        s = s < 0 ? s * 0x800000 : s * 0x7FFFFF;
        sample = s; 
        const intSample = Math.floor(sample);
        view.setUint8(offset, intSample & 0xFF);
        view.setUint8(offset + 1, (intSample >> 8) & 0xFF);
        view.setUint8(offset + 2, (intSample >> 16) & 0xFF);
        offset += 3;
      }
      pos++;
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

export default function LaunchPadMixer() {
  const [gameState, setGameState] = useState('IDLE'); 
  const [fileName, setFileName] = useState('');
  const [fileBlob, setFileBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourceSampleRate, setSourceSampleRate] = useState(44100); 
  const [lang, setLang] = useState('CN'); 
  const t = TRANSLATIONS[lang]; 
  
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const calculatedParamsRef = useRef(null); 
  const audioBufferRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [showConfig, setShowConfig] = useState(false);
  const [configSet, setConfigSet] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStats, setExportStats] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0); // Add Progress State

  const [tacticalConfig, setTacticalConfig] = useState({
      stealthMode: false,   
      overdrive: false,     
      magnetic: true,       
      compressionMode: 'AUTO', 
      thrust: 50            
  });

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    audioCtxRef.current = null;
    sourceNodeRef.current = null;
    setIsPlaying(false);
  };

  const resetAll = () => {
    stopAudio();
    setGameState('IDLE');
    setFileName('');
    setFileBlob(null);
    audioBufferRef.current = null;
    setShowExportModal(false);
    setExportStats(null);
    setDownloadProgress(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileBlob(file);
      stopAudio();
    }
  };

  const toggleLanguage = () => {
      setLang(prev => prev === 'CN' ? 'EN' : 'CN');
  };

  const analyzeAudio = async () => {
    if (!fileBlob) {
        if (fileInputRef.current) fileInputRef.current.click();
        return;
    }

    setGameState('ANALYZING');

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const arrayBuffer = await fileBlob.arrayBuffer();
        
        // --- FIX: MOV/Video Decode Error Handling ---
        let audioBuffer;
        try {
            audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        } catch (decodeErr) {
            console.error(decodeErr);
            alert("⚠️ 无法读取此文件！\n\n原因：格式不兼容或损坏 (如 iPhone MOV HEVC 编码)。\n请尝试提取音频，或使用 MP3 / M4A / WAV 格式。");
            setGameState('IDLE');
            return;
        }

        audioBufferRef.current = audioBuffer; 
        setSourceSampleRate(audioBuffer.sampleRate); 

        const channelData = audioBuffer.getChannelData(0);
        let peak = 0;
        let sumSquares = 0;
        let minLevel = 1.0; 

        // Optimized sampling (step 50) for large files
        for (let i = 0; i < channelData.length; i+=50) { 
            const abs = Math.abs(channelData[i]);
            if (abs > peak) peak = abs;
            if (abs > 0.0001 && abs < minLevel) minLevel = abs; 
            sumSquares += abs * abs;
        }
        const rms = Math.sqrt(sumSquares / (channelData.length/50));
        const crestFactor = peak / (rms + 0.0001); 
        const isHighDynamic = crestFactor > 4.0;
        
        const peakDb = 20 * Math.log10(peak || 0.0001);
        const minDb = 20 * Math.log10(minLevel || 0.0001);

        const initialStats = {
            peak: peak,
            peakDb: peakDb,
            minDb: Math.max(-90, minDb), 
            rms: rms,
            dynamicRange: peakDb - minDb
        };

        let thresholdDb, ratio, attack, release, makeupGain;

        if (isHighDynamic) {
            const targetThreshold = 20 * Math.log10(peak * 0.7);
            thresholdDb = Math.max(-50, targetThreshold); 
            ratio = 5;
            attack = 0.05; 
            release = 0.15; 
            makeupGain = 1.0; 
        } else {
            const targetThreshold = 20 * Math.log10(rms * 0.9) + (20 * Math.log10(peak) * 0.1);
            thresholdDb = Math.max(-60, targetThreshold);
            ratio = 12;
            attack = 0.005; 
            release = 0.4;  
            makeupGain = 1.1; 
        }
        if (thresholdDb > -10) thresholdDb = -10; 

        calculatedParamsRef.current = {
            thresholdDb, ratio, attack, release, makeupGain, initialStats
        };

        ctx.close();

        setTimeout(() => {
            setGameState('LAUNCHED');
        }, 1000);

    } catch (e) {
        alert("未知错误，请重试。");
        setGameState('IDLE');
    }
  };

  const buildAudioGraph = (ctx, destination, buffer, offline = false) => {
    const autoParams = calculatedParamsRef.current;
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    if (!offline) source.loop = true;

    const inputNode = ctx.createGain();
    const lowCut = ctx.createBiquadFilter();
    const eq1400 = ctx.createBiquadFilter();
    const eq7500 = ctx.createBiquadFilter();
    const saturator = ctx.createWaveShaper();
    const compressor = ctx.createDynamicsCompressor();
    const reverb = ctx.createConvolver();
    const reverbGain = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    const masterGain = ctx.createGain();
    
    let analyser = null;
    if (!offline) {
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
    }

    lowCut.type = 'highpass';
    lowCut.frequency.value = 30;
    lowCut.Q.value = 0.7;

    eq1400.type = 'peaking';
    eq1400.frequency.value = 1400;
    eq1400.Q.value = 1.0;
    eq1400.gain.value = tacticalConfig.overdrive ? 2.5 : 0; 

    eq7500.type = 'peaking';
    eq7500.frequency.value = 7500;
    eq7500.Q.value = 1.0;
    eq7500.gain.value = tacticalConfig.overdrive ? 3.0 : 0; 

    if (tacticalConfig.magnetic) {
        saturator.curve = makeTapeCurve(0.15); 
        saturator.oversample = offline ? '4x' : '2x';
    } else {
        saturator.curve = makeTapeCurve(0); 
    }

    let finalThreshold = autoParams.thresholdDb;
    let finalRatio = autoParams.ratio;
    let finalAttack = autoParams.attack;
    let finalRelease = autoParams.release;

    if (tacticalConfig.compressionMode === 'ASSAULT') {
        finalThreshold -= 5;
        finalRatio = Math.max(8, finalRatio * 1.5);
        finalAttack = 0.01; 
        finalRelease = 0.1; 
    } else if (tacticalConfig.compressionMode === 'SNIPER') {
        finalThreshold += 3;
        finalRatio = Math.min(4, finalRatio * 0.8);
        finalAttack = 0.1; 
        finalRelease = 0.5; 
    }

    const leverOffset = (tacticalConfig.thrust - 50) / 10 * -1; 
    finalThreshold += leverOffset;

    compressor.threshold.value = finalThreshold;
    compressor.knee.value = 10;
    compressor.ratio.value = finalRatio;
    compressor.attack.value = finalAttack;
    compressor.release.value = finalRelease;

    reverb.buffer = createImpulseResponse(ctx, 2.0, 3.0);
    reverbGain.gain.value = tacticalConfig.stealthMode ? 0 : 0.12; 

    limiter.threshold.value = -1.0; 
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.1;

    masterGain.gain.value = autoParams.makeupGain;

    source.connect(inputNode);
    inputNode.connect(lowCut);
    lowCut.connect(eq1400);
    eq1400.connect(eq7500);
    eq7500.connect(saturator);
    saturator.connect(compressor);
    
    compressor.connect(limiter); 
    compressor.connect(reverb); 
    reverb.connect(reverbGain);
    reverbGain.connect(limiter); 

    limiter.connect(masterGain);
    
    if (analyser) {
        masterGain.connect(analyser);
        analyser.connect(destination);
    } else {
        masterGain.connect(destination);
    }

    return { source, analyser };
  };

  const togglePlayback = () => {
    if (!audioBufferRef.current || !calculatedParamsRef.current) return;

    if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const { source, analyser } = buildAudioGraph(ctx, ctx.destination, audioBufferRef.current, false);
        
        source.start(0);
        audioCtxRef.current = ctx;
        sourceNodeRef.current = source;
        analyserRef.current = analyser;
        
        setIsPlaying(true);
        drawVisualizer();
        return;
    }
    
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        setIsPlaying(true);
        return;
    }
    if (audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
        setIsPlaying(false);
        return;
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    
    const draw = () => {
        if (!analyserRef.current) return;
        animationRef.current = requestAnimationFrame(draw);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 60;

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < bufferLength; i+=2) {
            const v = dataArray[i];
            const angle = (i / bufferLength) * Math.PI * 2 - (Math.PI / 2);
            const r = radius + (v / 255) * 50;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        if (isPlaying) {
            const bassAvg = dataArray.slice(0, 10).reduce((a,b)=>a+b,0) / 10;
            ctx.fillStyle = `rgba(0, 255, 204, ${bassAvg/800})`;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    draw();
  };

  const prepareExport = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          audioCtxRef.current.suspend();
          setIsPlaying(false);
      }
      
      const initial = calculatedParamsRef.current.initialStats;
      const makeup = calculatedParamsRef.current.makeupGain; 
      
      const leverOffset = (tacticalConfig.thrust - 50) / 10 * -1;
      let threshold = calculatedParamsRef.current.thresholdDb + leverOffset;
      if (tacticalConfig.compressionMode === 'ASSAULT') threshold -= 5;
      if (tacticalConfig.compressionMode === 'SNIPER') threshold += 3;
      
      const ratio = calculatedParamsRef.current.ratio;
      
      let procPeakDb = initial.peakDb;
      if (initial.peakDb > threshold) {
          procPeakDb = threshold + (initial.peakDb - threshold) / ratio;
      }
      procPeakDb += (20 * Math.log10(makeup));
      procPeakDb = Math.min(procPeakDb, -1.0);
      
      const procMinDb = initial.minDb + (20 * Math.log10(makeup));
      
      const eqOriginal = [0.6, 0.6, 0.6, 0.6, 0.6]; 
      const eqProcessed = [...eqOriginal];
      
      eqProcessed[0] -= 0.2; 
      
      if (tacticalConfig.magnetic) {
          eqProcessed[1] += 0.05; 
          eqProcessed[4] += 0.05; 
      }
      if (tacticalConfig.overdrive) {
          eqProcessed[2] += 0.15; 
          eqProcessed[3] += 0.18; 
      }

      setExportStats({
          original: initial,
          processed: {
              peakDb: procPeakDb,
              minDb: procMinDb,
              rms: Math.min(initial.rms * makeup, 0.9), 
          },
          eqProfile: {
              original: eqOriginal,
              processed: eqProcessed
          }
      });
      setShowExportModal(true);
  };

  const downloadAudio = async () => {
      if (!audioBufferRef.current) return;
      setIsExporting(true);
      setDownloadProgress(0);

      // --- Progress Bar Simulation ---
      const progressTimer = setInterval(() => {
          setDownloadProgress(prev => {
              if (prev >= 90) return 90; // Wait at 90%
              return prev + 2; // Speed of bar
          });
      }, 100);

      try {
        const originalBuffer = audioBufferRef.current;
        const sr = originalBuffer.sampleRate; 
        const reverbTailSeconds = 3.0; 
        const newLength = originalBuffer.length + (sr * reverbTailSeconds);

        const offlineCtx = new OfflineAudioContext(2, newLength, sr);
        
        buildAudioGraph(offlineCtx, offlineCtx.destination, originalBuffer, true);

        const renderedBuffer = await offlineCtx.startRendering();
        
        // --- Finish Progress ---
        clearInterval(progressTimer);
        setDownloadProgress(100);

        const wavBlob = bufferToWave24(renderedBuffer, renderedBuffer.length);
        const url = URL.createObjectURL(wavBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `MIXED_${fileName}_${sr/1000}k_24bit.wav`;
        link.click();
        
        setTimeout(() => {
            setIsExporting(false);
            setShowExportModal(false);
            setDownloadProgress(0);
        }, 1500);

      } catch (err) {
        clearInterval(progressTimer);
        setIsExporting(false);
        alert("导出失败，内存不足。");
      }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black font-sans text-zinc-300 select-none relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap');
        
        .font-military { font-family: 'Noto Sans SC', sans-serif; font-weight: 900; }
        .font-tech { font-family: 'Noto Sans SC', monospace; font-weight: 500; }
        
        .metal-texture {
            background-color: #2b2b2b;
            background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #222 10px, #222 20px);
        }
        .scanlines {
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
            background-size: 100% 4px;
        }
        @keyframes star-fly {
            0% { transform: translateY(-100px); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes nebula-pulse {
            0% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.1); }
            100% { opacity: 0.2; transform: scale(1); }
        }
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            animation: star-fly linear infinite;
        }
        
        input[type=range][orient=vertical] {
            writing-mode: bt-lr; 
            -webkit-appearance: slider-vertical; 
            width: 40px;
            height: 160px;
            padding: 0 5px;
        }
      `}</style>

      {/* --- FIX: Updated Accept Attribute for iPhone/MOV --- */}
      <input 
        ref={fileInputRef}
        id="file-upload" 
        type="file" 
        accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.aac,.flac" 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* --- SCENE 1: THE RACK --- */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-1000 ${gameState === 'LAUNCHED' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
         <div className="absolute inset-0 metal-texture z-0"></div>
         <div className="absolute inset-0 bg-black/40 z-0"></div>

         <div className="z-10 absolute top-8 w-full flex flex-col items-center">
            {/* Language Switch */}
            <div className="absolute top-2 right-4">
                <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-sm text-zinc-400 font-bold text-xs hover:border-zinc-500 hover:text-zinc-200 transition-all font-tech"
                >
                    <Globe className="w-3 h-3" />
                    <span>{lang === 'CN' ? 'EN' : 'CN'}</span>
                </button>
            </div>

            {/* --- FIX: Responsive Text Size for EN/CN --- */}
            <h1 className={`${lang === 'EN' ? 'text-4xl' : 'text-5xl'} text-zinc-400 font-military tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,1)] transition-all duration-300`}>
                {t.titleMain}<span className="text-red-600">{t.titleSub}</span>
            </h1>
            <div className="text-zinc-400 font-bold font-tech mt-2 tracking-[0.3em] uppercase text-sm">{t.subtitle}</div>
         </div>

         <div 
            className="z-10 mb-12 relative w-80 group cursor-pointer" 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
         >
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 rounded opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-black border border-zinc-600 p-1">
                <div className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center justify-center min-h-[6rem] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-10" 
                        style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}>
                    </div>
                    
                    {fileName ? (
                        <>
                            <div className="flex items-center gap-2 text-green-500 mb-1 animate-pulse">
                                <Disc className="w-4 h-4" />
                                <span className="font-tech font-bold text-xs tracking-widest">{t.dataLoaded}</span>
                            </div>
                            <div className="text-green-400 font-tech font-bold text-sm truncate w-full text-center border-t border-green-900/50 pt-2 mt-1">
                                {fileName}
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-zinc-500 mb-2 group-hover:text-zinc-400 transition-colors" />
                            <div className="text-zinc-500 font-tech font-bold text-xs tracking-[0.2em] group-hover:text-zinc-400">{t.insertData}</div>
                        </>
                    )}

                    <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-zinc-500"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-zinc-500"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-zinc-500"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-zinc-500"></div>
                </div>
            </div>
         </div>

         <div className="z-10 relative flex flex-col items-center">
            <button 
                onClick={analyzeAudio}
                disabled={gameState === 'ANALYZING'}
                className={`
                    w-48 h-48 rounded-full border-[6px] border-zinc-800 
                    bg-gradient-to-b from-red-600 to-red-900 
                    shadow-[0_10px_0_#3f0e0e,0_20px_20px_rgba(0,0,0,0.5),inset_0_5px_10px_rgba(255,255,255,0.2)]
                    active:shadow-[0_2px_0_#3f0e0e,inset_0_10px_20px_rgba(0,0,0,0.6)]
                    active:translate-y-[8px]
                    transition-all duration-100 group
                    flex flex-col items-center justify-center
                    relative overflow-hidden
                `}
            >
                <div className="absolute top-2 left-10 right-10 h-20 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm pointer-events-none"></div>
                
                {gameState === 'ANALYZING' ? (
                    <Zap className="w-16 h-16 text-yellow-300 animate-ping" />
                ) : (
                    <span className="font-military text-4xl text-red-100 tracking-wider drop-shadow-md group-hover:text-white">{t.push}</span>
                )}
            </button>

            {/* Config Button */}
            <div className="absolute -right-24 bottom-4">
                <button 
                    onClick={() => setShowConfig(true)}
                    className={`
                        w-12 h-12 rounded-full border-4 border-zinc-800
                        shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none transition-all
                        flex items-center justify-center
                        ${configSet ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'}
                    `}
                >
                    {configSet ? <Check className="w-6 h-6 text-white" /> : <Settings className="w-6 h-6 text-yellow-100" />}
                </button>
                <div className="text-[10px] text-zinc-400 font-bold font-tech mt-2 text-center">{t.adjust}</div>
            </div>
         </div>
         
         <div className="z-10 mt-16 text-zinc-500 font-bold font-tech text-xs tracking-widest">
            {t.caution}
         </div>
      </div>


      {/* --- SCENE 2: ORBIT (Result) --- */}
      <div className={`absolute inset-0 bg-black flex flex-col items-center justify-center transition-transform duration-1000 delay-200 ${gameState === 'LAUNCHED' ? 'translate-y-0' : 'translate-y-full'}`}>
         
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[90vw] h-[90vw] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen animate-[nebula-pulse_15s_infinite_alternate]"></div>
                <div className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-indigo-900/20 rounded-full blur-[150px] mix-blend-screen animate-[nebula-pulse_20s_infinite_alternate_reverse]"></div>
                <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="absolute inset-0 z-0 opacity-80">
               {[...Array(60)].map((_, i) => (
                   <div key={i} className="star" style={{
                       left: `${Math.random() * 100}%`,
                       top: `-${Math.random() * 20}px`,
                       animationDuration: `${1 + Math.random() * 4}s`,
                       animationDelay: `${Math.random() * 5}s`,
                       opacity: Math.random()
                   }}></div>
               ))}
            </div>

            <div 
                className="absolute top-[92%] left-[50%] -translate-x-1/2 w-[120vw] h-[120vw] rounded-full z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 5%, #22d3ee 0%, #0c4a6e 30%, #000000 70%)',
                    boxShadow: '0 -10px 60px rgba(34, 211, 238, 0.3), 0 -2px 10px rgba(34, 211, 238, 0.5)',
                }}
            >
            </div>
            <div className="absolute inset-0 scanlines opacity-20 pointer-events-none z-0"></div>
         </div>

         {/* HUD Interface */}
         <div className="z-20 w-full max-w-lg p-6 relative flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center border-b border-cyan-900/50 pb-2 mb-8">
                <div className="flex items-center gap-2">
                    <Radio className="text-cyan-400 animate-pulse w-4 h-4" />
                    <span className="text-cyan-500 font-tech font-bold text-sm tracking-widest">{t.orbitalLink}</span>
                </div>
                {/* DYNAMIC SR DISPLAY */}
                <div className="text-cyan-700 font-tech font-bold text-xs">{t.freq}: {sourceSampleRate ? (sourceSampleRate/1000).toFixed(1) : '44.1'}KHZ</div>
            </div>

            <div className="relative w-80 h-80 mx-auto mb-2 flex items-center justify-center">
                <div className="absolute inset-0 border border-cyan-800/50 rounded-full pointer-events-none"></div>
                <div className="absolute inset-8 border border-dashed border-cyan-800/30 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[1px] h-full bg-cyan-900/50"></div>
                    <div className="absolute w-full h-[1px] bg-cyan-900/50"></div>
                </div>
                <canvas ref={canvasRef} width="320" height="320" className="w-full h-full relative z-10" />
            </div>

            <div className="mb-8 z-30 relative w-full flex flex-col items-center">
                <button 
                    onClick={togglePlayback}
                    className={`
                        group relative flex items-center justify-center gap-3 px-10 py-4
                        bg-zinc-900 border-2 transition-all duration-200
                        ${isPlaying 
                            ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                            : 'border-zinc-600 hover:border-cyan-400'
                        }
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                    <div className={`w-3 h-3 rounded-full transition-colors ${isPlaying ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-red-900'}`}></div>
                    <div className="flex flex-col items-start">
                        <span className={`font-military text-lg tracking-widest ${isPlaying ? 'text-cyan-100' : 'text-zinc-300 group-hover:text-cyan-100'}`}>
                            {isPlaying ? t.disengage : t.engage}
                        </span>
                        <span className="font-tech text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase">
                            {isPlaying ? t.systemActive : t.readyToPlay}
                        </span>
                    </div>
                    {isPlaying ? <Pause className="w-5 h-5 text-cyan-400 ml-2" /> : <Play className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 ml-2" />}
                    
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-20"></div>
                    <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-20"></div>
                </button>
            </div>
            
            {/* Deploy / Download Button */}
            <div className="absolute right-0 bottom-32 z-30">
                <button 
                    onClick={prepareExport}
                    className="w-16 h-16 rounded-full border border-green-700 bg-green-900/20 hover:bg-green-800/40 text-green-500 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(21,128,61,0.2)] transition-all hover:scale-105"
                >
                    <Download className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-military tracking-widest">{t.deploy}</span>
                </button>
            </div>

            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-military text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">
                    {t.sequenceComplete}
                </h2>
                <div className="flex justify-center gap-4 text-xs font-tech font-bold text-cyan-400/80">
                    <span>{t.mode}: {tacticalConfig.compressionMode}</span>
                    <span>•</span>
                    <span>{t.thrust}: {tacticalConfig.thrust}%</span>
                    <span>•</span>
                    <span>{t.stealth}: {tacticalConfig.stealthMode ? 'ON' : 'OFF'}</span>
                </div>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={resetAll}
                    className="flex items-center gap-2 px-6 py-2 border border-red-900/50 text-red-700/50 font-tech hover:bg-red-900/20 hover:text-red-500 hover:border-red-500 transition-colors uppercase tracking-widest text-xs rounded-sm font-bold"
                >
                    <Power className="w-3 h-3" />
                    {t.abort}
                </button>
            </div>
         </div>
      </div>


      {/* --- MODAL: MILITARY CONFIG --- */}
      {showConfig && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border-2 border-yellow-600 w-full max-w-lg p-1 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <div className="bg-yellow-600/20 p-2 flex justify-between items-center border-b border-yellow-600/30 mb-2">
                    <span className="font-tech text-yellow-500 text-xs font-bold tracking-widest">// {t.tacticalConfig} //</span>
                    <button onClick={() => setShowConfig(false)}><X className="w-4 h-4 text-yellow-600 hover:text-yellow-400" /></button>
                </div>
                <div className="p-4 flex gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <ToggleButton label={t.stealth} subLabel={t.subLabelStealth} active={tacticalConfig.stealthMode} onClick={() => setTacticalConfig(p => ({...p, stealthMode: !p.stealthMode}))} icon={VolumeX} />
                         <ToggleButton label="OVERDRIVE" subLabel={t.subLabelOverdrive} active={tacticalConfig.overdrive} onClick={() => setTacticalConfig(p => ({...p, overdrive: !p.overdrive}))} icon={Zap} />
                         <ToggleButton label="MAGNETIC" subLabel={t.subLabelMagnetic} active={tacticalConfig.magnetic} onClick={() => setTacticalConfig(p => ({...p, magnetic: !p.magnetic}))} icon={Disc} />
                        <button onClick={() => setTacticalConfig(p => ({...p, compressionMode: p.compressionMode === 'ASSAULT' ? 'SNIPER' : 'ASSAULT'}))} className={`relative flex flex-col items-center justify-center p-3 border-2 transition-all duration-200 w-full h-24 ${tacticalConfig.compressionMode === 'ASSAULT' ? 'bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-blue-900/40 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'}`}>
                             <Activity className={`w-6 h-6 mb-2 ${tacticalConfig.compressionMode === 'ASSAULT' ? 'text-red-400' : 'text-blue-400'}`} />
                             <span className={`font-sans font-bold text-sm tracking-wider ${tacticalConfig.compressionMode === 'ASSAULT' ? 'text-red-100' : 'text-blue-100'}`}>{tacticalConfig.compressionMode}</span>
                             <span className="font-tech text-[9px] text-zinc-400 font-bold uppercase mt-1">{tacticalConfig.compressionMode === 'ASSAULT' ? t.subLabelAggressive : t.subLabelGentle}</span>
                        </button>
                    </div>
                    <div className="w-24 bg-zinc-800 border border-zinc-700 p-2 flex flex-col items-center rounded relative">
                        <div className="text-[10px] font-tech font-bold text-yellow-500 mb-2 whitespace-nowrap">{t.dynamicsThrust}</div>
                        <div className="relative flex-1 w-full flex justify-center">
                            <div className="absolute w-2 h-full bg-zinc-900 border border-zinc-700 rounded-full"></div>
                            <input type="range" min="0" max="100" orient="vertical" value={tacticalConfig.thrust} onChange={(e) => setTacticalConfig(p => ({...p, thrust: Number(e.target.value)}))} className="z-10 h-full opacity-0 w-full cursor-pointer absolute" />
                            <div className="absolute w-12 h-8 bg-gradient-to-b from-yellow-600 to-yellow-800 border-2 border-yellow-500 rounded shadow-lg flex items-center justify-center pointer-events-none transition-all duration-75" style={{ bottom: `${tacticalConfig.thrust}%`, transform: 'translateY(50%)' }}><div className="w-full h-[1px] bg-black/50"></div></div>
                        </div>
                        <div className="mt-2 font-mono text-yellow-400 text-xs">{tacticalConfig.thrust}%</div>
                    </div>
                </div>
                <div className="p-2 border-t border-zinc-800 flex justify-end">
                     <button onClick={() => { setConfigSet(true); setShowConfig(false); }} className="bg-yellow-700 hover:bg-yellow-600 text-black font-bold font-tech px-6 py-2 text-sm uppercase tracking-wider">{t.confirmParams}</button>
                </div>
            </div>
        </div>
      )}

      {/* --- EXPORT REPORT MODAL (MISSION DEBRIEF) --- */}
      {showExportModal && exportStats && (
        <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-green-800 w-full max-w-4xl shadow-[0_0_50px_rgba(22,101,52,0.3)] flex flex-col max-h-[90vh]">
                
                {/* Header & Legend */}
                <div className="bg-green-900/20 p-4 border-b border-green-800">
                     <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-3">
                            <BarChart3 className="text-green-500 w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-military text-green-100 tracking-widest">{t.missionDebrief}</h2>
                                <p className="text-[10px] font-tech text-green-400 font-bold tracking-[0.3em]">{t.analysisReport}</p>
                            </div>
                         </div>
                         <button onClick={() => setShowExportModal(false)}><X className="text-green-700 hover:text-green-400 w-6 h-6" /></button>
                     </div>
                     
                     <div className="flex justify-end gap-6 text-[10px] font-tech font-bold tracking-widest pt-2 border-t border-green-900/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>
                            <span className="text-yellow-500">{t.original}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                            <span className="text-green-500">{t.processed}</span>
                        </div>
                     </div>
                </div>

                {/* Dashboard Grid */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 overflow-y-auto">
                    
                    {/* Gauge 1: EQ Spectrum */}
                    <div className="bg-black/40 border border-zinc-800 p-4 rounded flex flex-col items-center col-span-2">
                        <div className="w-full flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                            <span className="text-xs font-tech font-bold text-zinc-400 tracking-widest">{t.eqSpectrum}</span>
                            <span className="text-[10px] font-mono text-zinc-500">20Hz - 20kHz</span>
                        </div>
                        <div className="w-full h-32 relative">
                             <EqFrequencyResponseChart 
                                dataOriginal={exportStats.eqProfile.original} 
                                dataProcessed={exportStats.eqProfile.processed} 
                                labels={t.freqLabels}
                                t={t}
                             />
                        </div>
                        <div className="mt-2 text-center w-full">
                            <div className="text-[10px] text-zinc-500 font-bold">{t.responseProfile}</div>
                            <div className="text-lg font-mono text-green-400 font-bold">{tacticalConfig.overdrive ? t.harmonicBoost : t.balanced}</div>
                        </div>
                    </div>

                    {/* Gauge 2: True Dynamic Range */}
                    <div className="bg-black/40 border border-zinc-800 p-4 rounded flex flex-col items-center">
                        <span className="text-xs font-tech font-bold text-zinc-400 mb-4 tracking-widest">{t.dynamicRange}</span>
                        <div className="w-32 h-32 relative">
                             <DynamicRangeBar 
                                minDbOriginal={exportStats.original.minDb}
                                maxDbOriginal={exportStats.original.peakDb}
                                minDbProcessed={exportStats.processed.minDb}
                                maxDbProcessed={exportStats.processed.peakDb}
                                t={t}
                             />
                        </div>
                        <div className="mt-4 text-center w-full flex justify-between px-2 text-[9px] font-mono text-zinc-400 font-bold">
                             <div>MAX: {exportStats.processed.peakDb.toFixed(1)}dB</div>
                             <div>MIN: {exportStats.processed.minDb.toFixed(1)}dB</div>
                        </div>
                    </div>

                    {/* Gauge 3: Loudness Bar */}
                    <div className="bg-black/40 border border-zinc-800 p-4 rounded flex flex-col items-center">
                        <span className="text-xs font-tech font-bold text-zinc-400 mb-4 tracking-widest">{t.loudness}</span>
                        <div className="w-24 h-32">
                             <BarComparison val1={exportStats.original.rms * 2} val2={exportStats.processed.rms * 2} />
                        </div>
                         <div className="mt-4 text-center">
                            <div className="text-[10px] text-zinc-500 font-bold">{t.gainIncrease}</div>
                            <div className="text-lg font-mono text-green-400 font-bold">
                                {exportStats.original.rms > 0 ? `+${(20 * Math.log10(exportStats.processed.rms / exportStats.original.rms)).toFixed(1)}` : "+0.0"} dB
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action - FIX: Progress Bar Added */}
                <div className="p-6 border-t border-green-900/30 flex justify-between items-center bg-black/60">
                     <div className="text-xs font-tech font-bold text-zinc-400">
                        <div>{t.file}: {fileName}</div>
                        <div>{t.format}: WAV 24-BIT / {sourceSampleRate ? (sourceSampleRate/1000).toFixed(1) : '44.1'}KHZ</div>
                     </div>
                     <button 
                        onClick={downloadAudio}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-8 py-3 bg-green-700 hover:bg-green-600 text-black font-bold font-military tracking-widest transition-all hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
                     >
                        {isExporting ? (
                            <div className="w-full flex flex-col gap-1">
                                <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-300 shadow-[0_0_8px_#86efac] transition-all duration-300 ease-out"
                                        style={{ width: `${downloadProgress}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] animate-pulse">PROCESSING {downloadProgress}%</span>
                            </div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {t.confirmDownload}
                            </>
                        )}
                     </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}

