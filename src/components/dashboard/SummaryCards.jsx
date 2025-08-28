import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar
} from '@mui/material';

export default function SummaryCards({ data }) {
  return (
    <Grid container spacing={3}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" component="div" color="primary">
                    {item.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    backgroundColor: item.color,
                    height: 56,
                    width: 56
                  }}
                >
                  {item.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
