import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

interface TimerProps {
    dataHora: string;
}

const Timer: React.FC<TimerProps> = ({ dataHora }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    const calcularTempoDecorrido = (dataHora: string) => {
        if (!dataHora) return 0;
        let inicio = new Date(dataHora).getTime();
        const atual = now.getTime();

        if (inicio > atual + 60000) {
            inicio = new Date(dataHora + 'Z').getTime();
        }

        return Math.floor((atual - inicio) / 1000);
    };

    const formatarTempo = (segundos: number) => {
        if (segundos < 0) return "00:00";
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getCorTempo = (segundos: number) => {
        const tempoEsperado = 15;
        const porcentagem = (segundos / (tempoEsperado * 60)) * 100;

        if (porcentagem < 70) return '#4CAF50';
        if (porcentagem < 100) return '#FFA726';
        return '#EF5350';
    };

    const segundos = calcularTempoDecorrido(dataHora);

    return (
        <Chip
            icon={<AccessTime />}
            label={formatarTempo(segundos)}
            size="small"
            sx={{
                bgcolor: getCorTempo(segundos),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                height: '24px'
            }}
        />
    );
};

export default Timer;
