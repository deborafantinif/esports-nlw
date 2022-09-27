import express from "express";
import {PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesToHoursString } from "./utils/convert-minutes-to-hours-string";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient();

app.get('/games', async (_req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  })
  res.json(games)
})

app.post('/games/:id/ads', async (req, res) => {
  console.log('eee');
  console.log(req.body);
  const gameId  = req.params.id;
  const body = req.body;
  await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,      
      weekDays: body.weekDays.join(','),    
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),    
      useVoiceChannel: body.useVoiceChannel,
      createdAt: body.createdAt,
    }
  })
  res.status(201).json([])
})

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  res.json(ads.map((ad) => {
    return {
      ...ad,
      hourEnd: convertMinutesToHoursString(ad.hourEnd),
      hourStart: convertMinutesToHoursString(ad.hourStart),
      weekDays: ad.weekDays.split(',')
    }
  }))
})

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;
  const ad = await prisma.ad.findUnique({
    select: {
      discord: true,
    },
    where: {
      id: adId
    }
  })
  res.json(ad)
})

app.listen(3333);