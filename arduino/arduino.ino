#define COUNT_JOINTS 3
#define DEGREES_JOINTS 180

void setup() {
  Serial.begin(9600);
}

void loop() {
  static unsigned long timer = millis();

  if (millis() - timer <= 1000)
    return false;

  timer = millis();

  byte data[COUNT_JOINTS];
  mockAnanlogRead(data);
  comBroadcast(data);
}

void mockAnanlogRead (byte *mock) {
  for(int i = 0; i < COUNT_JOINTS; i++) {
    mock[i] = random(0, 180);
  }
}

// формирование сообщения и передача по COM порту
void comBroadcast (byte *req) {
  char res[] = "";

  for (byte i = 0; i < COUNT_JOINTS; i++) {
    itoa(req[i], strchr(res, NULL), DEC);
    if (i != COUNT_JOINTS - 1)
      strcat(res, ",");
  }

  Serial.println(res);
}
