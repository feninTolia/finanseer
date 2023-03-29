import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
// import { useGetKpisQuery } from '@/state/api';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import regression, { DataPoint } from 'regression';
import kpis from '@/data/kpis.json';

const Prediction: React.FC = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  // const { data: kpiData } = useGetKpisQuery();

  const kpiData = kpis;

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(({ revenue }, idx) => {
      return [idx, revenue];
    });

    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }, i) => {
      return {
        name: month,
        'Actual Revenue': revenue / 100,
        'Regression Line': regressionLine.points[i][1] / 100,
        'Predicted Revenue': regressionLine.predict(i + 12)[1] / 100,
      };
    });
  }, [kpiData]);

  return (
    <DashboardBox width="100%" height="100%" padding="1rem" overflow="hidden">
      <FlexBetween m="1rem 2.5rem" gap="0.1rem">
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            charted revenue and predicted revenue based on a simple linear
            regression model
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions(!isPredictions)}
          sx={{
            color: palette.grey[900],
            bgcolor: palette.grey[700],
            boxShadow: '0.1rem 0.1rem 0.1rem rgb(0 0 0 / .4)',
          }}
        >
          Show Predicted Revenue for Next Year
        </Button>
      </FlexBetween>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 35,
            left: 35,
            bottom: 150,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: '10px' }}>
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis
            domain={[12000, 26000]}
            axisLine={{ strokeWidth: '0' }}
            style={{ fontSize: '10px' }}
            tickFormatter={(v) => `$${v}`}
          >
            <Label
              value="Revenue in USD"
              offset={-5}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
          />
          {isPredictions && (
            <Line
              strokeDasharray="5 5"
              dataKey="Predicted Revenue"
              stroke={palette.secondary[500]}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default Prediction;
