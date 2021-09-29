#define COUNT_JOINTS 3 // количество датчиков
#define DEGREES_JOINTS 180 // максимальный угол поворота
#define BROADCAST_DELAY 250 // задержка передачи
#define DEBUG 0 // 0 - датчики, 1 - случайные данные

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(128);
}

void loop() {
  static unsigned long timer = millis();
  byte data[COUNT_JOINTS];
  comHealth();

  if (millis() - timer >= BROADCAST_DELAY) {
    timer = millis();

    if (DEBUG)
      mockAnanlogRead(data);
    else
      ananlogRead(data);

    comBroadcast(data);
  }
}

void comHealth () {
  if (Serial.available()) {
    int command = Serial.parseInt();

    if (command == 0)
      Serial.println("ok");
  }
}

void ananlogRead (byte *d) {
  for(int i = 0; i < COUNT_JOINTS; i++)
    d[i] = map(analogRead(14 + i), 0, 1023, 0, DEGREES_JOINTS);
}

void mockAnanlogRead (byte *mock) {
  for(int i = 0; i < COUNT_JOINTS; i++)
    mock[i] = random(0, DEGREES_JOINTS);
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
