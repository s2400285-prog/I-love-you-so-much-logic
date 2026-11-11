// Edit this file in VS Code. The password below is a story prop visible to
// anyone with the source. Use a separate host-side login for private media.
const config = {
  creator: 'James Traigo',
  signature: 'James',
  recipient: 'Baby Julie',
  password: 'babyjulie', // [SECRET_PASSWORD] · demo password, case-sensitive
  passwordHint: 'Your nickname, all lowercase and with no spaces.', // [PERSONAL_PASSWORD_HINT]
  music: './assets/music/our-song.mp3', // [MUSIC_FILE] · use an MP3 you provide
  musicTitle: 'Our song',
  photo: './assets/images/our-photo.jpg', // [OUR_PHOTO] · only one photograph
  photoAlt: 'James and Julie together', // Describe the picture for screen readers.
  photoMemory: 'One photograph, and a whole world of things I wish I could say.', // [PHOTO_MEMORY]
  intro: "It's me, James. I made you a little world filled with things I wish I could tell you in person. Get comfortable, take your time, and come in when you're ready. I've been looking forward to sharing this with you.",
  wrongPassword: 'Try again, Baby. Think of something that feels like us.',
  drawer: "Some things are too special to fit inside an envelope. I think I'll spend more time showing you instead.",
  gardenSecret: "Even in a world full of beautiful things, I'd still look for you first.",
  closing: "If I could spend the last minute of this hour anywhere, I'd spend it beside you, Baby Julie. 💗",
  photoNotes: [ // [PERSONAL_NOTE_1], [PERSONAL_NOTE_2], [PERSONAL_NOTE_3]
    {
      title: 'What this picture means to me',
      text: [
        'If someone asked me why I made a whole room for one picture, I think I would just ask them to look at it with me. There is something lovely about having a little piece of the world that can stay exactly where we left it. I can come back to it even when everything else about the day has changed.',
        'I would keep this picture somewhere I could find it without looking too hard. I like the idea of being halfway through an ordinary day and suddenly having a reason to stop and smile.'
      ],
      reflection: 'What would you want us to remember about the day this photo was taken?'
    },
    {
      title: 'What I feel when I see it',
      text: [
        'There is a little kind of homesickness I get when I look at a picture of us. It makes me want to be where you are, even if all we would do is sit close and talk about what we had for lunch. And then I smile, because the person I miss is the same person I get to look forward to.',
        'I hope when you look at it, you get a tiny part of that feeling too. I put a light here so you could take as long as you want.'
      ],
      reflection: 'What part of the picture does your eye go to first?'
    },
    {
      title: 'A moment I hope we share',
      text: [
        'Someday, I would love to ask someone to take a picture of us halfway through a day we are having too much fun to document. I hope we look a little unprepared. Maybe one of us will still be talking or laughing while the other tries to get us both to face the camera.',
        'When we see it later, I hope we can remember something the camera missed. Maybe the song playing nearby, or what made us laugh right before the picture. I would love to tell that part of the story with you.'
      ],
      reflection: 'Where would you like us to take our next picture together?'
    }
  ],
  future: [
    {
      id:'cafe', title:'The Rainy Café', label:'Switch on the lamp', after:'Sit in the lamplight', // [CAFE_MEMORY]
      text:[
        'If we find ourselves waiting out the rain in a little café someday, I hope we get the seat by the window. I would like to hear the sort of story that starts with “Oh, I forgot to tell you,” and turns into three more stories before we remember our drinks.',
        'I would let the rain decide when we leave. Maybe you would show me something funny on your phone. Maybe we would take turns trying to guess what the people outside are in such a hurry for. I think the nicest part would be getting to look across the table and see you there.'
      ],
      reflection:'What would you order if we had nowhere to be for the next hour?'
    },
    {
      id:'sunset', title:'The Pink Sunset', label:'Let the sky change', after:'Watch the last light', // [SUNSET_MEMORY]
      text:[
        'I hope we get a day when we can take the longer way home just because the sky looks good. I would love to stop for a picture of you in that soft pink light, then put my phone away and actually watch the sun go down with you.',
        'Maybe we will choose a place neither of us has been before. I would enjoy getting a little lost, finding somewhere to eat, and knowing that we have enough time to make one more stop if you see somewhere you want to go.'
      ],
      reflection:'If we could take a walk anywhere at sunset, where would you pick?'
    },
    {
      id:'evening', title:'A Quiet Evening Together', label:'Light the windows', after:'Stay by the window', // [EVENING_MEMORY]
      text:[
        'Some evening, when we are both too tired to make a plan, I would love to sit beside you and look out at whatever view we have. We can talk if there is something on your mind. If you have had your fill of words for the day, you can lean against me and I will keep you company.',
        'I would bring you something warm and let you choose what we listen to. Then I would sit there as the lights come on one by one and feel pretty lucky that this is where I get to end my day.'
      ],
      reflection:'What helps you feel at home after a long day?'
    }
  ],
  stars: [
    {title:'Your smile', text:['I like the way your smile makes me forget whatever sentence I was about to say. I usually end up smiling too and hoping you did not notice how easy that was.','My favorite part is the second before a smile, when I can almost see you deciding whether to let it happen. I would happily tell you something silly just to see it again.'], reflection:'What made you smile today?'},
    {title:'Your kindness', text:['I admire the thought you put into how someone might be feeling. I hope you feel some of that care come back to you, especially on days when you are the one who could use a little softness.','When I think about how I want to love you, this is one of the first things I think of. I want to notice when your hands are full, ask how you really are, and leave room for the honest answer.'], reflection:'What is a small kindness you would like to receive more often?'},
    {title:'The ordinary days', text:['There are days I would forget completely if I did not have the chance to share a little of them with you. A simple “How was your day?” means more when I get to answer it honestly and then hear how yours went.','That is what I want more of. More passing thoughts, more little updates, more things that were only worth telling one person. I would like to be someone you can tell them to.'], reflection:'Which ordinary moment would you spend together if you could?'},
    {title:'How much you notice', text:['I like the way you give small things your attention. I think it is a quiet kind of love to make room for details, and I hope I learn to do that for you. I want to remember how you like things and notice when you change your mind.','I hope I ask good questions and wait for your answer. Sometimes the best part of a conversation is what someone says after they know they have time to think.'], reflection:'What is one little thing you wish people would notice about you?'},
    {title:'Your laughter', text:['Your laughter is one of the sounds I want to hear on a day that has been entirely too serious. I would gladly ruin the timing of a joke to hear you laugh at how badly I told it.','I hope there are a lot of evenings when we are tired and laughing anyway. I hope one of us sometimes has to say “wait, let me finish,” because the other has already started laughing before the good part.'], reflection:'What kind of joke always gets you?'},
    {title:'How I feel beside you', text:['I love the idea of being able to put down the busy part of my day and be with you. I would like us to have time when no one has to think of the next thing to say. We can just be together and see what comes to mind.','I want to be that kind of company for you as well. I hope there is always room next to me for whatever kind of day you have had.'], reflection:'Where would you go together when you both need a quieter day?'},
    {title:'Your little ways', text:['There are things people do so naturally that they never think of them as reasons someone might love them. I hope you know how beautiful it can be just to watch you be yourself.','As I get to know you better, I look forward to discovering more of those little ways. The things you reach for first, the things you want to save for later, and the things you do when you are comfortable enough to forget someone is watching.'], reflection:'What little habit of yours would you want me to learn by heart?'},
    {title:'The joy you bring', text:['You give my day a place to go when I need something nice to think about. Sometimes it is as simple as imagining what I would tell you if you were beside me. Even that makes my day feel better.','I want to bring you some joy too. I hope there are times when you think of me and smile before you can even remember what you were thinking about.'], reflection:'What would you like us to make more time for?'}
  ],
  envelopes: [
    {
      title:'What I admire about you',
      text:[
        'Julie, I admire how many things you can be at the same time. You can care deeply and still have your own opinion. You can want closeness and need a little time to yourself. You have a whole life I get to learn about, and I hope I always give you room to tell me who you are in your own words.',
        'I admire the part of you that keeps trying when a day asks more of you than you expected. I hope you are proud of that part. I hope you are just as gentle with the part that needs a break.',
        'If I could leave one thought in this envelope for a difficult day, it would be this. You can come to me before you have found the right words. I will be glad you trusted me with what you had.'
      ],
      reflection:'What is something you are proud of that you have never had a chance to tell me?'
    },
    {
      title:'What I miss about you',
      text:[
        'I miss the freedom to tell you something the moment it happens. If you were here right now, I would probably pull a chair close and tell you about the part of today I thought you would find funniest. Then I would ask what you had been up to and let the conversation go wherever it wanted.',
        'There is a funny moment when I think of something I want to tell you and almost turn as if you are already beside me. I wish I could hand you a little bundle of all those moments.',
        'The next time we have a little time together, I hope you tell me something that never made it into a message. I would like to hear it the way you tell it, with all the little parts that feel too long to type.'
      ],
      reflection:'What is one story you would rather tell me in person?'
    },
    {
      title:'What I am grateful for',
      text:[
        'I am grateful that you let me get to know you a little at a time. It feels like an invitation I get to accept again each time you tell me something that matters to you, or when we find a new thing we can laugh about together.',
        'I am grateful for the chance to be honest with you. I want you to be able to tell me when I have understood you well and when I have a little more listening to do. I think that kind of trust grows slowly, and I am happy to give it time.',
        'Mostly, I am grateful that you are here reading this. You could be doing a hundred other things. For a little while I get to be the one keeping you company.'
      ],
      reflection:'What is something small you are grateful for this week?'
    },
    {
      title:'What I look forward to',
      text:[
        'I look forward to finding out what we are like when we have more time together. I want to know who picks where we eat, who takes longer to leave the house, and whether we can agree on a song for the way home.',
        'I look forward to the bigger conversations as well. I want to hear what you hope your life feels like a few years from now. I would like to tell you what I am hoping for, and see what we can make room for together.',
        'I look forward to the moment when we have to say goodbye after a lovely day and one of us thinks of a reason to stay another ten minutes. I have a feeling I would be the one looking for that reason.'
      ],
      reflection:'What would you love for us to do on a day with no plans?'
    }
  ],
  // Draft written for this build. Paste the original letter into this array.
  // Each object is one reveal, with one string per paragraph.
  letter: [
    {
      title:'I wanted a little more time',
      text:[
        'My Baby Julie,',
        'I thought about sending you a letter, and then I kept thinking of more things I wanted to put inside it. A little sky, so I could show you some of the things I love about you. A place for our picture. A window we could sit by even when we are looking at completely different skies.',
        'That is how I ended up making you this world. I wanted an excuse to spend a little more time with you, even on a day when I could only be here in words. I hope somewhere along the way you found something that made you smile.'
      ]
    },
    {
      title:'The details I hope to learn',
      text:[
        'I like getting to know you, Julie. There are things I hope you will tell me so often that I start remembering them before you finish the sentence. What you want to eat when you have had a hard day. The story you tell whenever a certain song comes on. Where you would go if you could take an afternoon off from everything.',
        'I want to keep asking even after I think I know the answers. I want to be there when an old favorite changes, or you find something new you cannot wait to tell me about. There will always be more about you to love than I have had time to learn.'
      ]
    },
    {
      title:'On the harder days',
      text:[
        'Some days I hope we will know exactly what to say to each other. On the days we get it wrong, I hope we give ourselves a minute and try again with a little more patience. I want to learn how to listen when the answer is hard to hear and how to tell you the truth kindly when I am the one who needs to speak.',
        'If you ever need some quiet, I hope you can ask me for it. If you want company, I hope you can ask for that too. I want to be the person who says, “Take your time, Baby. I am here,” and makes it easy for you to believe me.'
      ]
    },
    {
      title:'What I am looking forward to',
      text:[
        'I imagine a lot of little things with you. A table by a rainy window. A picture taken in a hurry because the light is changing. The question “Are you hungry?” turning into the best part of an otherwise unremarkable day.',
        'I want to have time to enjoy the days we get. I want to learn what makes you feel cared for and remember to do it when there is no occasion. I want to be able to look back on the year and name a dozen small things we did because we wanted to be together.'
      ]
    },
    {
      title:'One thing to take with you',
      text:[
        'Thank you for opening my invitation. I know I asked for a little of your time. If you have to get back to your day, take this with you. Someone is glad you exist in the world exactly as you are today. Someone wants to know how you slept, what made you laugh, and whether you got to eat something good. That someone is me.',
        'And if you feel like staying a little longer, the window is still open. There is one more light outside that I left on for you.'
      ]
    }
  ],
  secretMessage: 'There are things I am still learning how to say out loud. I hope you can hear this one clearly. Knowing you makes me want to pay closer attention to the way I love. I want it to reach you in small, reliable ways, like an answer when you call and an honest conversation when a day has gone wrong.', // [SECRET_MESSAGE]
  gardenNotes: [
    {title:'The things we could grow',text:['I would love for us to take turns bringing little things into each other’s days. You can send me a song you think I will like. I can save you the better half of something sweet. If we do it often enough, I think we will have a whole collection of ordinary days that feel like ours.'],reflection:'What little ritual would you like to share?'},
    {title:'A bench for two',text:['If we had a bench in this garden, I would put it somewhere we could watch the sky change without getting up. You could tell me about whatever you have been thinking about lately, and I could take a little longer than usual to answer. I like imagining enough time for a good conversation.'],reflection:'What would you tell me if we were sitting there now?'},
    {title:'Flowers to take home',text:['I would let you choose whatever is blooming. I would watch you put a few stems together and learn which flowers you reach for first. I hope I get to remember those flowers the next time I want to surprise you.'],reflection:'Which flowers would you choose?'}
  ],
  memories: [
    {title:'A handful of starlight',text:'I like being able to name the small things I appreciate about you. I hope I remember to tell you more often.'},
    {title:'A sky shaped like a heart',text:'I wish I could sit beneath this sky with you and hear which star you liked best.'},
    {title:'Ink still warm',text:'I like imagining you holding a letter I was a little nervous to give you.'},
    {title:'The last envelope',text:'If you kept every word I wrote, I would still come back to tell you one more thing.'},
    {title:'In the light',text:'If I had room for one picture on my desk, I would give you the frame.'},
    {title:'Three lines in the margin',text:'I hope our next picture comes with another story I will want to tell you twice.'},
    {title:'Places we could go',text:'Give me a little time and anywhere you would like to be. I would love to go with you.'},
    {title:'A letter kept safe',text:'There is a part of me that will always feel a little shy when you read what I write. Thank you for taking care with my words.'}
  ],
  secrets: {
    moon:{title:'The Door Behind the Moon', token:'Glass garden key', text:['I left the light on here for the nights when the world feels a little too loud. There is room to sit and catch your breath. If I were here, I would ask whether you wanted to talk or have me stay quietly beside you.','Take this little glass key when you leave. I like the idea of you carrying something from this room into another part of the story.']},
    curtain:{title:'The Door Behind the Curtain', token:'Diary key', text:['I sometimes wish I could show you the moment before I send a message. I read it once more, think about how you might say it back to me, and wonder whether you will hear the smile I had while writing it.','I left a small key here. It belongs to the diary where I keep a few thoughts I usually take an extra minute to say.']},
    under:{title:'The Door Under the Stars', token:'Folded starlight', text:['Dear Julie, if we had a sky like this to ourselves, I would ask you to pick a place to sit. I would bring something warm for us to drink and see how many stars we could find before the conversation wandered away.','I think I would remember the talking as much as the view. We could keep this little piece of starlight for a day when the sky is cloudy.']},
    passage:{title:'The Secret Passage', token:'Rose glass charm', text:['Every object here was a chance to tell you one small thing. Thank you for looking closely enough to find this room. I hope there are days when I can do the same for you and notice something you would like someone to see.']},
    collection:{title:'The Room of Eight Hearts', token:'Keeper of the hearts', text:['If I could give you these eight hearts in person, I would tuck them into places you would find throughout the day. One by your cup. One inside a book. One in the hand you would reach out when I asked you to close your eyes.','You found them all here. I hope you have a favorite. I would love to know which one you would keep nearest.']},
    hiddenHeart:{title:'The Hidden Heart',token:'Heart constellation',text:['I imagined you taking a moment to look for the shape. I would have liked to be beside you and see the second you realized what it was. It feels sweet to think of your hands helping me finish something I started for you.']},
    promise:{title:'The Promise Constellation',token:'Three points of light',text:['A little promise for each light. I will pay attention. I will tell you what is on my mind. I will make time to hear what is on yours. I would like to spend a long time finding ordinary ways to keep those promises.']},
    ribbon:{title:'The Ribbon’s Hidden Envelope',token:'Satin thread',text:['You followed this ribbon through all the places I hoped you would stop. If you tied it around my wrist, I think I would leave it there for the rest of the day. It would make me happy to carry a little color from this world into mine.']},
    diary:{title:'The Locked Diary',token:'Diary page',text:['I keep thinking about how I can make it easier for you to tell me what you need. I would love to be someone you can ask for help, or call to tell a story, or say “Can you just stay a minute?” without feeling like you have to explain why.','I hope I show you I mean that in the way I answer. I want to give you the time I would hope you would give me.']},
    mirror:{title:'The Secret Mirror',token:'Pearl reflection',text:['I wish you could look through my eyes for a few seconds when you are being hard on yourself. I would like you to see how easily I think of things to love about you, and how much of that has to do with the way you are when you feel comfortable.']},
    flower:{title:'The Flower That Remembers',token:'First blossom',text:['I hope we take a walk someday when the flowers are out and stop to look at the ones we usually pass. I would like to hear which one you would plant near your window if you had space for only one. I would remember your answer.']},
    invisible:{title:'The Invisible Message',token:'Message in the light',text:['I like the thought of leaving you a message where it takes a moment for the light to reach it. If you ever get one from me in the middle of an ordinary day, it will probably be because I wished I could stop what I was doing and be with you for a while.']},
    shooting:{title:'The Shooting Star',token:'A wish kept safe',text:['If I could send a wish ahead of you into tomorrow, I would ask for something gentle to find you before the day gets busy. A few more minutes in bed. A kind message. A reason to laugh while you are getting ready. I hope you find something like that.']},
    bottle:{title:'The Glass Bottle',token:'A note by the water',text:['If I could send you one note on a day we were far apart, I think it would just say “Tell me everything when you get back.” I would keep a little space in my day open for however much you wanted to share.']},
    musicBox:{title:'The Tiny Music Box',token:'The little melody',text:['I hope we find a song we cannot listen to without thinking of each other. If it comes on somewhere we cannot talk, I hope I catch your eye for a second and we both know what the other is thinking.']},
    butterfly:{title:'The Glasswing Butterfly',token:'Glasswing',text:['I hope we have mornings that start slowly enough to notice something like this. I would like to open a window, bring you a cup of something warm, and point out whatever is visiting the flowers today.']},
    petal:{title:'The Floating Petal',token:'A rose petal',text:['I like that some lovely things only ask for a second of your time. I picked this little petal up for you. If it reminds you to take one good breath before you go back to your day, it will have done what I hoped.']},
    frame:{title:'Behind the Photograph',token:'The tiny envelope',text:['I left this behind the frame because I hope you will come back to the picture. Next time, maybe I will be sitting beside you when you look at it. I would like to ask what you remember first.']},
    garden:{title:'Through the Glass Door',token:'The floating garden',text:['I wanted there to be one last room you could find simply because you were curious. I filled it with quiet things we could do together. A little wishing water, a place to sit, and a few flowers to bring back with you.']},
    fountain:{title:'A Wish on the Water',token:'Pearl ripple',text:['I hope we get to make a wish side by side someday and keep it to ourselves until it comes true. If you ever want to tell me yours, I would love to hear it. We might be able to do a little something to help it along.']},
    gardenHidden:{title:'The Smallest Light',token:'Hidden garden heart',text:[]},
    garden0:{title:'The Things We Could Grow',token:'Seedling'},
    garden1:{title:'A Bench for Two',token:'A place beside you'},
    garden2:{title:'Flowers to Take Home',token:'A little bouquet'}
  },
  finalHeart: {
    title:'The Final Heart',
    token:'The heart James kept for last',
    text:[
      'You found the little things I tucked away for you, right down to the last one. I keep picturing you reading this and looking up for a second. I wish I were there when you did, so I could give you the smile I have been holding since I started making this.',
      'I want to keep making little things you can come back to. Some will be as simple as a note on your desk or a picture in a frame. This one happens to have a sky. There is still a place beside me, Baby Julie, whenever you feel like staying a little longer.'
    ]
  }
};

window.JulieWorld = { config };
