#define COUNT_JOINTS 3
#define DEGREES_JOINTS 180
#define BROADCAST_DELAY 100
#define DEBUG 0

void setup() {
  Serial.begin(9600);
}

void loop() {
  static unsigned long timer = millis();

  if (millis() - timer <= BROADCAST_DELAY)
    return;

  timer = millis();

  byte data[COUNT_JOINTS];

  if (DEBUG)
    mockAnanlogRead(data);
  else
    ananlogRead(data);

  comBroadcast(data);
}

void ananlogRead (byte *data) {
  for(int i = 0; i < COUNT_JOINTS; i++)
    data[i] = map(analogRead(14 + i), 0, 1023, 0, 180);
}

void mockAnanlogRead (byte *mock) {
  for(int i = 0; i < COUNT_JOINTS; i++)
    mock[i] = random(0, 180);
}

// COM PORT DETERMINATOR \r\n
void comBroadcast (byte *req) {
  char res[] = "";

  for (byte i = 0; i < COUNT_JOINTS; i++) {
    itoa(req[i], strchr(res, NULL), DEC);
    if (i != COUNT_JOINTS - 1)
      strcat(res, ",");
  }

  Serial.println(res);
}
